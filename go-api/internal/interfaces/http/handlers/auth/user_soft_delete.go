package auth

import (
	"encoding/json"
	"net/http"

	domainUser "execute_academy/internal/domain/mongo/user"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
)

// SoftDelete deactivates the user account
func (h *Handler) SoftDelete(w http.ResponseWriter, r *http.Request) {
	var in struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		AppError.BadRequest("Invalid JSON body").WriteToResponse(w)
		return
	}
	oid, err := domainUser.ParseObjectID(in.ID)
	if err != nil {
		AppError.BadRequest("Invalid id").WriteToResponse(w)
		return
	}
	if err := h.repo.SoftDelete(r.Context(), oid); err != nil {
		AppError.InternalServerErrorWithError("Failed to delete user", err).WriteToResponse(w)
		return
	}
	response.WriteNoContent(w)
}
