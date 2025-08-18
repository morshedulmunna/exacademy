package routes

import (
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Router handles gRPC service registration
type Router struct {
	server *grpc.Server
}

// NewRouter creates a new gRPC router
func NewRouter(server *grpc.Server) *Router {
	return &Router{
		server: server,
	}
}

// SetupRoutes configures all gRPC services
func (r *Router) SetupRoutes() {

	// Create services

	// Create external service example (demonstrates external service consumption)

	// Register services

	// Register external service example (you can create your own proto for this)
	// externalpb.RegisterExternalServiceServer(r.server, externalServiceExample)

	// Enable reflection for debugging
	reflection.Register(r.server)
}

// GetServer returns the underlying gRPC server
func (r *Router) GetServer() *grpc.Server {
	return r.server
}
