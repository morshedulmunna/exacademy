package routes

import (
	"net/http"
	"time"

	"execute_academy/config"
	appAuth "execute_academy/internal/applications/auth"
	domainUser "execute_academy/internal/domain/mongo/user"
	handlerAuth "execute_academy/internal/interfaces/http/handlers/auth"
	"execute_academy/internal/interfaces/http/middleware"
	"execute_academy/pkg/cache"
	"execute_academy/pkg/email"
	"execute_academy/pkg/shared/session"

	"go.mongodb.org/mongo-driver/mongo"
)

// RegisterAuthRoutes wires authentication and user routes
func RegisterAuthRoutes(mux *http.ServeMux, db *mongo.Database, emailSvc *email.EmailService, cache *cache.RedisCache) {
	manager := middleware.NewManager()

	userRepo := domainUser.NewRepository(db)
	sessMgr := session.NewManager("sid", 24*time.Hour, config.GetConfig().IsProduction())
	authSvc := appAuth.NewService(userRepo)
	authHandler := handlerAuth.NewHandler(authSvc, sessMgr, userRepo, emailSvc, cache)

	// Public auth routes
	mux.Handle("POST /api/v1/auth/register", manager.With(http.HandlerFunc(authHandler.Register)))
	mux.Handle("POST /api/v1/auth/login", manager.With(http.HandlerFunc(authHandler.Login)))
	// Google OAuth routes
	mux.Handle("GET /api/v1/auth/google/login", manager.With(http.HandlerFunc(authHandler.GoogleLogin)))
	mux.Handle("GET /api/v1/auth/google/callback", manager.With(http.HandlerFunc(authHandler.GoogleCallback)))

	// Session-protected routes
	sessAuth := middleware.NewSessionAuthenticator(sessMgr)
	mux.Handle("GET /api/v1/auth/me", manager.With(http.HandlerFunc(authHandler.Me), sessAuth.AuthenticateSession))
	mux.Handle("POST /api/v1/auth/logout", manager.With(http.HandlerFunc(authHandler.Logout), sessAuth.AuthenticateSession))

	// mux.Handle("DELETE /api/v1/users", manager.With(http.HandlerFunc(authHandler.SoftDelete), sessAuth.AuthenticateSession, sessAuth.RequireSessionRoles("admin")))
}
