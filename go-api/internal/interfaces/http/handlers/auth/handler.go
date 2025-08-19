package auth

import (
	appauth "execute_academy/internal/applications/auth"
	domainUser "execute_academy/internal/domain/mongo/user"
	"execute_academy/pkg/cache"
	"execute_academy/pkg/email"
	"execute_academy/pkg/shared/session"
)

// Handler exposes authentication HTTP endpoints.
type Handler struct {
	svc     *appauth.Service
	sessMgr *session.Manager
	repo    *domainUser.Repository
	email   *email.EmailService
	cache   *cache.RedisCache
}

// NewHandler constructs an auth Handler.
func NewHandler(svc *appauth.Service, sessMgr *session.Manager, repo *domainUser.Repository, emailSvc *email.EmailService, cache *cache.RedisCache) *Handler {
	return &Handler{svc: svc, sessMgr: sessMgr, repo: repo, email: emailSvc, cache: cache}
}

func pickFirstRole(roles []string) string {
	if len(roles) == 0 {
		return "user"
	}
	return roles[0]
}
