package routes

import (
	"net/http"
	"skoolz/internal/interfaces/http/handlers/global"
	"skoolz/internal/interfaces/http/middleware"

	"github.com/jmoiron/sqlx"
)

// Router handles HTTP routing
// SetupRoutes configures all routes with global middleware
func SetupRoutes(mux *http.ServeMux, db *sqlx.DB) http.Handler {
	// Initialize middleware manager
	manager := middleware.NewManager()

	// Initialize handlers
	welcomeHandler := global.NewWelcomeHandler()
	healthHandler := global.NewHealthHandler()
	notFoundHandler := global.NewNotFoundHandler()

	// Define routes with middleware
	mux.Handle("GET /api", manager.With(http.HandlerFunc(welcomeHandler.Welcome)))
	mux.Handle("GET /api/v1", manager.With(http.HandlerFunc(welcomeHandler.Welcome)))
	mux.Handle("GET /health", manager.With(http.HandlerFunc(healthHandler.HealthCheck)))

	// community routes conncet
	RegisterCommunityRoutes(mux, db)

	// Catch-all route for 404 Not Found
	mux.HandleFunc("/", notFoundHandler.NotFound)

	return mux
}
