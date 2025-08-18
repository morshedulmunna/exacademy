package auth

import (
	"net/http"

	Authtypes "execute_academy/internal/applications/auth/types"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
	"execute_academy/pkg/shared/utils"
)

// Register handles user registration.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var in Authtypes.RegisterInput
	utils.ParseRequestBodyWithValidation(w, r, &in)

	u, err := h.svc.Register(r.Context(), in)
	if err != nil {
		AppError.UnprocessableEntity("Registration failed", map[string]interface{}{"error": err.Error()}).WriteToResponse(w)
	}
	response.WriteCreated(w, "User registered", map[string]any{"user": u})
}
