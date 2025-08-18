package auth

import (
	"net/http"

	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
	"execute_academy/pkg/shared/utils"
)

// Me returns the current authenticated user's profile extracted from JWT claims.
func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := utils.GetUserFromRequest(r)
	if !ok || claims == nil {
		AppError.Unauthorized("Unauthorized").WriteToResponse(w)
	}
	userID, err := utils.ParseHexObjectID(claims.UserID)
	if err != nil {
		AppError.BadRequest("Invalid user ID").WriteToResponse(w)
	}

	user, err := h.repo.GetByID(r.Context(), userID)
	if err != nil {
		AppError.NotFound("User not found").WriteToResponse(w)
	}

	response.WriteOK(w, map[string]any{"user": user})
}
