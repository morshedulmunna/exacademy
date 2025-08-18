package auth

import (
	"encoding/json"
	"net/http"

	appauth "execute_academy/internal/applications/auth"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
)

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

	u, err := h.svc.Register(r.Context(), appauth.RegisterInput{
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
