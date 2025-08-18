package middleware

import (
	"context"
	"net/http"

	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/session"
	"execute_academy/pkg/shared/utils"
)

// SessionAuthenticator holds the session manager for middleware use.
type SessionAuthenticator struct {
	Manager *session.Manager
}

// NewSessionAuthenticator constructs a session-based authenticator.
func NewSessionAuthenticator(m *session.Manager) *SessionAuthenticator {
	return &SessionAuthenticator{Manager: m}
}

// AuthenticateSession validates the session cookie and injects user claims in context.
func (sa *SessionAuthenticator) AuthenticateSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		sess, ok := sa.Manager.Get(r)
		if !ok || sess == nil || sess.User == nil {
			AppError.Unauthorized("Unauthorized").WriteToResponse(w)
			return
		}
		// Use shared utils context key for consistency
		ctx := utils.AddUserToContext(r.Context(), sess.User)
		// Also attach under a local typed key to avoid collisions
		type authCtxKey struct{}
		ctx = context.WithValue(ctx, authCtxKey{}, sess.User)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RequireSessionRoles checks the role in user claims from the session.
func (sa *SessionAuthenticator) RequireSessionRoles(roles ...string) func(http.Handler) http.Handler {
	allowed := map[string]struct{}{}
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			claims, ok := utils.GetUserFromRequest(r)
			if !ok || claims == nil {
				AppError.Unauthorized("Unauthorized").WriteToResponse(w)
				return
			}
			if _, ok := allowed[claims.Role]; !ok {
				AppError.Forbidden("Insufficient permissions").WriteToResponse(w)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}
