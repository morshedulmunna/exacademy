package utils

import (
	"context"
	"net/http"
)

type ctxKeyUser struct{}

type UserClaims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Role     string `json:"role"`
	IsActive bool   `json:"is_active"`
}

// GetUserFromContext retrieves user information from the request context
func GetUserFromContext(ctx context.Context) (*UserClaims, bool) {
	user, ok := ctx.Value(ctxKeyUser{}).(*UserClaims)
	return user, ok
}

// GetUserFromRequest retrieves user information from the request context
func GetUserFromRequest(r *http.Request) (*UserClaims, bool) {
	return GetUserFromContext(r.Context())
}

// AddUserToContext stores user claims in the provided context and returns the derived context
func AddUserToContext(ctx context.Context, claims *UserClaims) context.Context {
	return context.WithValue(ctx, ctxKeyUser{}, claims)
}
