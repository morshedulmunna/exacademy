package routes

import (
	"net/http"
	community "skoolz/internal/interfaces/http/handlers"
	"skoolz/internal/interfaces/http/middleware"

	"go.mongodb.org/mongo-driver/mongo"
)

// RegisterCommunityRoutes registers community-related HTTP routes
func RegisterCommunityRoutes(mux *http.ServeMux, db *mongo.Database) {
	manager := middleware.NewManager()

	communityHandler := community.NewCommunityHandler(db)

	// Create Communities
	mux.Handle("POST /api/v1/communities", manager.With(http.HandlerFunc(communityHandler.Create)))

	// List communities
	mux.Handle("GET /api/v1/communities", manager.With(http.HandlerFunc(communityHandler.List)))
	// Community details by slug (subtree match; handler extracts slug)
	mux.Handle("GET /api/v1/communities/", manager.With(http.HandlerFunc(communityHandler.DetailsBySlug)))
}
