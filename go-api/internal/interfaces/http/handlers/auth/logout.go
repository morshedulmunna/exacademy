package auth

import (
	"execute_academy/pkg/shared/response"
	"net/http"
)

// Logout destroys the current session
func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	h.sessMgr.Destroy(w, r)
	response.WriteNoContent(w)
}
