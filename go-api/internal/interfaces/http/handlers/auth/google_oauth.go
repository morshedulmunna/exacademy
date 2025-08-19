package auth

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"execute_academy/config"
	"execute_academy/internal/domain/mongo/user"
	"execute_academy/pkg/shared/utils"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// GoogleLogin starts the Google OAuth flow by redirecting the user to Google's consent screen.
func (h *Handler) GoogleLogin(w http.ResponseWriter, r *http.Request) {
	cfg := config.GetConfig()
	if cfg.OAuth.GoogleClientID == "" || cfg.OAuth.GoogleClientSecret == "" {
		http.Error(w, "Google OAuth is not configured", http.StatusServiceUnavailable)
		return
	}

	// Optional post-login redirect path from query
	postLoginRedirect := r.URL.Query().Get("redirect")
	if postLoginRedirect == "" {
		postLoginRedirect = "/"
	}

	// Generate CSRF state and persist in a short-lived cookie
	state := generateRandomHex(24)
	h.setTemporaryCookie(w, "oauth_state", state, 10*time.Minute)
	// Persist desired redirect path separately
	h.setTemporaryCookie(w, "post_login_redirect", postLoginRedirect, 30*time.Minute)

	oauthCfg := h.googleOAuthConfig(cfg)
	authURL := oauthCfg.AuthCodeURL(state, oauth2.AccessTypeOnline)
	http.Redirect(w, r, authURL, http.StatusFound)
}

// GoogleCallback handles the OAuth callback from Google, creates the user if needed, creates a session and redirects to the frontend.
func (h *Handler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	cfg := config.GetConfig()

	queryState := r.URL.Query().Get("state")
	stateCookie, _ := r.Cookie("oauth_state")
	if stateCookie == nil || stateCookie.Value == "" || stateCookie.Value != queryState {
		http.Error(w, "Invalid OAuth state", http.StatusBadRequest)
		return
	}

	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Missing code", http.StatusBadRequest)
		return
	}

	oauthCfg := h.googleOAuthConfig(cfg)
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	tok, err := oauthCfg.Exchange(ctx, code)
	if err != nil {
		http.Error(w, fmt.Sprintf("Token exchange failed: %v", err), http.StatusBadRequest)
		return
	}

	info, err := fetchGoogleUserInfo(ctx, tok)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to fetch user info: %v", err), http.StatusBadGateway)
		return
	}

	// Find or create user
	var u *user.User
	u, err = h.repo.GetByEmail(ctx, info.Email)
	if err != nil {
		// Create new user
		username := deriveUsername(info.Email, info.Name)
		u = &user.User{
			Email:           strings.ToLower(info.Email),
			Username:        username,
			FirstName:       firstNameFrom(info.Name),
			LastName:        lastNameFrom(info.Name),
			FullName:        info.Name,
			ProfilePic:      info.Picture,
			Provider:        "google",
			ProviderID:      info.Subject,
			IsEmailVerified: info.EmailVerified,
			IsActive:        true,
			HasAccess:       true,
			Roles:           []string{"user"},
			CreatedAt:       time.Now().UTC(),
			UpdatedAt:       time.Now().UTC(),
		}
		// Ensure unique username (handle duplicate key errors)
		for i := 0; i < 3; i++ {
			if created, createErr := h.repo.Create(ctx, u); createErr == nil {
				u = created
				break
			} else if isDuplicateKeyError(createErr) {
				u.Username = fmt.Sprintf("%s_%s", u.Username, generateRandomHex(4))
				continue
			} else {
				http.Error(w, fmt.Sprintf("Failed to create user: %v", createErr), http.StatusInternalServerError)
				return
			}
		}
	}

	// Create session
	_, _ = h.sessMgr.Create(w, &utils.UserClaims{
		UserID:   u.ID.Hex(),
		Email:    u.Email,
		Name:     u.FullName,
		Role:     pickFirstRole(u.Roles),
		IsActive: u.IsActive,
	})

	// Determine redirect URL with fallback
	base := strings.TrimRight(cfg.OAuth.FrontendAppURL, "/")
	path := "/"
	if c, err := r.Cookie("post_login_redirect"); err == nil && c != nil && c.Value != "" {
		path = c.Value
	} else if qp := r.URL.Query().Get("redirect"); qp != "" {
		path = qp
	}
	if !strings.HasPrefix(path, "/") {
		path = "/" + path
	}
	http.Redirect(w, r, base+path, http.StatusFound)
}

// googleOAuthConfig builds the oauth2.Config for Google
func (h *Handler) googleOAuthConfig(cfg *config.Config) *oauth2.Config {
	redirectURL := cfg.OAuth.OAuthRedirectURL
	if redirectURL == "" {
		redirectURL = fmt.Sprintf("http://localhost:%d/api/v1/auth/google/callback", cfg.HttpPort)
	}
	return &oauth2.Config{
		ClientID:     cfg.OAuth.GoogleClientID,
		ClientSecret: cfg.OAuth.GoogleClientSecret,
		RedirectURL:  redirectURL,
		Scopes:       []string{"openid", "email", "profile"},
		Endpoint:     google.Endpoint,
	}
}

// setTemporaryCookie sets a short-lived, HTTP-only cookie
func (h *Handler) setTemporaryCookie(w http.ResponseWriter, name, value string, ttl time.Duration) {
	expires := time.Now().Add(ttl)
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		Expires:  expires,
		MaxAge:   int(ttl.Seconds()),
		HttpOnly: true,
		Secure:   config.GetConfig().IsProduction(),
		SameSite: http.SameSiteLaxMode,
	})
}

// googleUserInfo represents a subset of fields returned by Google's OIDC userinfo endpoint
type googleUserInfo struct {
	Subject       string `json:"sub"`
	Email         string `json:"email"`
	EmailVerified bool   `json:"email_verified"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
}

func fetchGoogleUserInfo(ctx context.Context, tok *oauth2.Token) (*googleUserInfo, error) {
	if tok == nil || !tok.Valid() {
		return nil, errors.New("invalid token")
	}
	client := oauth2.NewClient(ctx, oauth2.StaticTokenSource(tok))
	resp, err := client.Get("https://openidconnect.googleapis.com/v1/userinfo")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("userinfo status %d", resp.StatusCode)
	}
	var info googleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, err
	}
	return &info, nil
}

func generateRandomHex(numBytes int) string {
	b := make([]byte, numBytes)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

func deriveUsername(email, name string) string {
	if email != "" {
		local := strings.Split(strings.ToLower(email), "@")[0]
		return sanitizeUsername(local)
	}
	if name != "" {
		return sanitizeUsername(strings.ToLower(strings.ReplaceAll(name, " ", "_")))
	}
	return "user_" + generateRandomHex(4)
}

func sanitizeUsername(in string) string {
	out := make([]rune, 0, len(in))
	for _, r := range in {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '_' || r == '.' || r == '-' {
			out = append(out, r)
		}
	}
	if len(out) == 0 {
		return "user_" + generateRandomHex(4)
	}
	return string(out)
}

// naive duplicate key detection for MongoDB
func isDuplicateKeyError(err error) bool {
	if err == nil {
		return false
	}
	// fragile but practical: look for code 11000 in error string
	return strings.Contains(err.Error(), "E11000") || strings.Contains(err.Error(), "duplicate key")
}

func firstNameFrom(full string) string {
	parts := strings.Fields(full)
	if len(parts) == 0 {
		return ""
	}
	return parts[0]
}

func lastNameFrom(full string) string {
	parts := strings.Fields(full)
	if len(parts) <= 1 {
		return ""
	}
	return strings.Join(parts[1:], " ")
}
