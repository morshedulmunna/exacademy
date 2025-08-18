package auth

import (
	"encoding/json"
	"net/http"

	domainUser "execute_academy/internal/domain/mongo/user"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
)

// UpdateProfile updates allowed profile fields for the authenticated user.
func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var in map[string]any
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		AppError.BadRequest("Invalid JSON body").WriteToResponse(w)
		return
	}

	// This minimal example expects an "id" field with Mongo ObjectID hex string
	idStr, _ := in["id"].(string)
	if idStr == "" {
		AppError.BadRequest("Missing id").WriteToResponse(w)
		return
	}

	oid, err := domainUser.ParseObjectID(idStr)
	if err != nil {
		AppError.BadRequest("Invalid id").WriteToResponse(w)
		return
	}

	delete(in, "id")
	updated, err := h.repo.Update(r.Context(), oid, toBsonM(in))
	if err != nil {
		AppError.InternalServerErrorWithError("Failed to update user", err).WriteToResponse(w)
		return
	}
	response.WriteOK(w, "Profile updated", map[string]any{"user": updated})
}
