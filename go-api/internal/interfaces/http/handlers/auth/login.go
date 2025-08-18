package auth

import (
	"encoding/json"
	"net/http"
	"time"

	"execute_academy/config"
	appauth "execute_academy/internal/applications/auth"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/exceptions"
	"execute_academy/pkg/shared/response"
	"execute_academy/pkg/shared/utils"
)

// Login handles user login.
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var in struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		AppError.BadRequest("Invalid JSON body").WriteToResponse(w)
		return
	}

	u, tokens, err := h.svc.Login(r.Context(), appauth.LoginInput{
		Email:    in.Email,
		Password: in.Password,
	})
	if err != nil {
		AppError.Forbidden(exceptions.ErrInvalidCredentials.Error()).WriteToResponse(w)
		return
	}
	// Create session cookie
	_, _ = h.sessMgr.Create(w, &utils.UserClaims{UserID: u.ID.Hex(), Email: u.Email, Name: u.FullName, Role: pickFirstRole(u.Roles), IsActive: u.IsActive})

	cfg := config.GetConfig()
	ttlMinutes := cfg.JwtAccessTTLMinutes
	if ttlMinutes <= 0 {
		ttlMinutes = 1440
	}
	sessionExpiresAt := time.Now().Add(time.Duration(ttlMinutes) * time.Minute)

	response.WriteOK(w, "Logged in", map[string]any{"user": u, "tokens": tokens, "session_expires_at": sessionExpiresAt})
}
