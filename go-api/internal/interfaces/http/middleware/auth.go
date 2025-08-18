package middleware

import (
	"context"
	"net/http"
	"strings"

	"execute_academy/config"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/utils"

	"github.com/golang-jwt/jwt/v5"
)

// authContextKey is a typed context key for storing user claims in context
type authContextKey struct{}

// AuthenticateJWT validates the Authorization Bearer token and injects user claims into the request context
func AuthenticateJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authz := r.Header.Get("Authorization")
		if authz == "" {
			AppError.Unauthorized("Missing Authorization header").WriteToResponse(w)
			return
		}

		parts := strings.SplitN(authz, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || parts[1] == "" {
			AppError.Unauthorized("Invalid Authorization header").WriteToResponse(w)
			return
		}

		tokenStr := parts[1]
		secret := []byte(config.GetConfig().JwtSecret)

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			// Ensure signing method is HMAC
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenUnverifiable
			}
			return secret, nil
		})
		if err != nil || !token.Valid {
			AppError.Unauthorized("Invalid or expired token").WriteToResponse(w)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			AppError.Unauthorized("Invalid token claims").WriteToResponse(w)
			return
		}

		userClaims := &utils.UserClaims{
			UserID:   stringFromClaims(claims, "sub"),
			Email:    stringFromClaims(claims, "email"),
			Name:     stringFromClaims(claims, "name"),
			Role:     stringFromClaims(claims, "role"),
			IsActive: boolFromClaims(claims, "is_active"),
		}

		ctx := context.WithValue(r.Context(), authContextKey{}, userClaims)
		// Bridge into shared utils context key for compatibility
		type ctxKeyUser struct{}
		ctx = context.WithValue(ctx, ctxKeyUser{}, userClaims)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// RequireRoles authorizes an already authenticated user by required role(s)
func RequireRoles(roles ...string) func(http.Handler) http.Handler {
	allowed := make(map[string]struct{}, len(roles))
	for _, r := range roles {
		allowed[r] = struct{}{}
	}
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, ok := utils.GetUserFromRequest(r)
			if !ok || user == nil {
				AppError.Unauthorized("Unauthorized").WriteToResponse(w)
				return
			}
			if _, ok := allowed[user.Role]; !ok {
				AppError.Forbidden("Insufficient permissions").WriteToResponse(w)
				return
			}
			next.ServeHTTP(w, r)
		})
	}
}

func stringFromClaims(claims jwt.MapClaims, key string) string {
	if v, ok := claims[key]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return ""
}

func boolFromClaims(claims jwt.MapClaims, key string) bool {
	if v, ok := claims[key]; ok {
		if b, ok := v.(bool); ok {
			return b
		}
	}
	return false
}
