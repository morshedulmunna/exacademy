package http

import (
	"context"
	"execute_academy/config"
	"execute_academy/internal/interfaces/http/routes"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"

	"strconv"
	"syscall"
	"time"

	"go.elastic.co/apm/module/apmhttp"
	"go.mongodb.org/mongo-driver/mongo"
)

// Server represents the HTTP server
type Server struct {
	server  *http.Server
	mongoDb *mongo.Database
	done    chan struct{}
	logger  *slog.Logger
	conf    *config.Config
}

// NewServer creates a new HTTP server
func NewServer(conf *config.Config, mongoDb *mongo.Database, logger *slog.Logger) *Server {

	// Create router with database connection
	mux := http.NewServeMux()
	handler := routes.SetupRoutes(mux, mongoDb)

	// Wrap handler with APM monitoring
	apmHandler := apmhttp.Wrap(handler)

	return &Server{
		server: &http.Server{
			Addr:         ":" + strconv.Itoa(conf.HttpPort),
			Handler:      apmHandler,
			ReadTimeout:  15 * time.Second,
			WriteTimeout: 15 * time.Second,
			IdleTimeout:  60 * time.Second,
		},
		mongoDb: mongoDb,
		logger:  logger,
		conf:    conf,
		done:    make(chan struct{}),
	}
}

// Start starts the HTTP server with graceful shutdown
func (s *Server) Start() error {
	// Start server in a goroutine
	go func() {
		s.logger.Info("Starting HTTP server", "port", s.conf.HttpPort)

		if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			s.logger.Error("HTTP server error", "error", err)
		}
	}()

	// Wait for shutdown signal
	<-s.shutdown()

	// Perform graceful shutdown
	return s.gracefulShutdown()
}

// gracefulShutdown performs a graceful shutdown of the server
func (s *Server) gracefulShutdown() error {
	// Close the done channel to signal shutdown
	close(s.done)

	// Create context with timeout for graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	s.logger.Info("Initiating graceful shutdown", "timeout", "30s")

	// MongoDB client is managed by the caller; nothing to close here

	// Attempt graceful shutdown
	if err := s.server.Shutdown(ctx); err != nil {
		s.logger.Error("Graceful shutdown failed, forcing close", "error", err)

		// Force close if graceful shutdown fails
		if closeErr := s.server.Close(); closeErr != nil {
			return fmt.Errorf("failed to force close server: %w", closeErr)
		}
		return fmt.Errorf("graceful shutdown failed: %w", err)
	}

	s.logger.Info("Server shutdown completed successfully")
	return nil
}

// shutdown returns a channel that will be closed when shutdown should occur.
func (s *Server) shutdown() chan os.Signal {
	// Make channel to listen for an interrupt or terminate signal from the OS.
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, os.Interrupt, syscall.SIGTERM)

	return shutdown
}
