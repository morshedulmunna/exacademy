package auth

import (
	appauth "execute_academy/internal/applications/auth"
	domainUser "execute_academy/internal/domain/mongo/user"
	"execute_academy/pkg/shared/session"
)

// Handler exposes authentication HTTP endpoints.
type Handler struct {
	svc     *appauth.Service
	sessMgr *session.Manager
	repo    *domainUser.Repository
}

// NewHandler constructs an auth Handler.
func NewHandler(svc *appauth.Service, sessMgr *session.Manager, repo *domainUser.Repository) *Handler {
	return &Handler{svc: svc, sessMgr: sessMgr, repo: repo}
}

func pickFirstRole(roles []string) string {
	if len(roles) == 0 {
		return "user"
	}
	return roles[0]
}

func toBsonM(m map[string]any) map[string]any { return m }
