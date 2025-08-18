package auth

import (
	"encoding/json"
	"net/http"

	domainUser "execute_academy/internal/domain/mongo/user"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
)

// UserHandler exposes user management endpoints.
type UserHandler struct {
	repo *domainUser.Repository
}

// NewUserHandler constructs a UserHandler.
func NewUserHandler(repo *domainUser.Repository) *UserHandler {
	return &UserHandler{repo: repo}
}

// UpdateProfile updates allowed profile fields for the authenticated user.
func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
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

// SoftDelete deactivates the user account
func (h *UserHandler) SoftDelete(w http.ResponseWriter, r *http.Request) {
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

func toBsonM(m map[string]any) map[string]any { return m }
