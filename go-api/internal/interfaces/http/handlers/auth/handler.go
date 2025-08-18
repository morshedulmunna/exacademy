package auth

import (
	"encoding/json"
	"net/http"
	"time"

	"execute_academy/internal/applications/auth"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
	"execute_academy/pkg/shared/session"
	"execute_academy/pkg/shared/utils"
)

// Handler exposes authentication HTTP endpoints.
type Handler struct {
	svc     *auth.Service
	sessMgr *session.Manager
}

// NewHandler constructs an auth Handler.
func NewHandler(svc *auth.Service, sessMgr *session.Manager) *Handler {
	return &Handler{svc: svc, sessMgr: sessMgr}
}

// Register handles user registration.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var in struct {
		Email     string `json:"email"`
		Username  string `json:"username"`
		Password  string `json:"password"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		AppError.BadRequest("Invalid JSON body").WriteToResponse(w)
		return
	}

	u, err := h.svc.Register(r.Context(), auth.RegisterInput{
		Email:     in.Email,
		Username:  in.Username,
		Password:  in.Password,
		FirstName: in.FirstName,
		LastName:  in.LastName,
	})
	if err != nil {
		AppError.UnprocessableEntity("Registration failed", map[string]interface{}{"error": err.Error()}).WriteToResponse(w)
		return
	}
	response.WriteCreated(w, "User registered", map[string]any{"user": u})
}

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

	u, tokens, err := h.svc.Login(r.Context(), auth.LoginInput{
		Email:    in.Email,
		Password: in.Password,
	})
	if err != nil {
		AppError.Unauthorized("Invalid credentials").WriteToResponse(w)
		return
	}
	// Create session cookie
	_, _ = h.sessMgr.Create(w, &utils.UserClaims{UserID: u.ID.Hex(), Email: u.Email, Name: u.FullName, Role: pickFirstRole(u.Roles), IsActive: u.IsActive})
	response.WriteOK(w, "Logged in", map[string]any{"user": u, "tokens": tokens, "session_expires_at": time.Now().Add(24 * time.Hour)})
}

// Me returns the current authenticated user's profile extracted from JWT claims.
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := utils.GetUserFromRequest(r)
	if !ok || claims == nil {
		AppError.Unauthorized("Unauthorized").WriteToResponse(w)
		return
	}
	response.WriteOK(w, map[string]any{"user": claims})
}

// Logout destroys the current session
func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	h.sessMgr.Destroy(w, r)
	response.WriteNoContent(w)
}

func pickFirstRole(roles []string) string {
	if len(roles) == 0 {
		return "user"
	}
	return roles[0]
}
