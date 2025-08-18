package grpc

import (
	"execute_academy/config"
	"execute_academy/internal/interfaces/grpc/middleware"
	"execute_academy/internal/interfaces/grpc/routes"
	"fmt"
	"log/slog"
	"net"
	"strconv"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Server represents the gRPC server
type Server struct {
	server *grpc.Server
}

// NewServer creates a new gRPC server
func NewServer() *Server {
	// Get the container instance

	// Create gRPC server with options
	grpcServer := grpc.NewServer(
		grpc.UnaryInterceptor(middleware.UnaryInterceptor),
	)

	// Create router and setup routes
	router := routes.NewRouter(grpcServer)
	router.SetupRoutes()

	// Enable reflection for debugging
	reflection.Register(grpcServer)

	return &Server{
		server: grpcServer,
	}
}

// Start starts the gRPC server with graceful shutdown
func (s *Server) Start() error {
	conf := config.GetConfig()
	listener, err := net.Listen("tcp", ":"+strconv.Itoa(conf.GrpcPort))
	if err != nil {
		slog.Error("Failed to listen", "error", err, "port", conf.GrpcPort)
		return fmt.Errorf("failed to listen: %w", err)
	}

	go func() {
		slog.Info("Starting gRPC server", "port", conf.GrpcPort)
		fmt.Printf("Starting gRPC server on port %d\n", conf.GrpcPort)
		s.server.Serve(listener)
	}()

	return nil
}
