package cmd

import (
	"context"
	"os"
	"skoolz/config"
	"skoolz/internal/interfaces/http"
	"skoolz/pkg/cache"
	"skoolz/pkg/logger"

	"github.com/spf13/cobra"
)

var serveRestCmd = &cobra.Command{
	Use:   "serve-rest",
	Short: "Serve the REST API",
	RunE:  serveRest,
}

func serveRest(cmd *cobra.Command, args []string) error {
	conf := config.GetConfig()
	logger := logger.NewLogger()

	// Connect MongoDB (kept alive for the server lifecycle)
	ctx := context.Background()
	mongoDB, mongoClient, err := config.NewMongoDatabase(ctx)
	if err != nil {
		logger.Error("Failed to connect to MongoDB", "error", err)
		os.Exit(1)
	}
	logger.Info("Connected to MongoDB successfully")
	defer func() {
		if err := mongoClient.Disconnect(ctx); err != nil {
			logger.Error("Failed to disconnect MongoDB client", "error", err)
		} else {
			logger.Info("MongoDB client disconnected successfully")
		}
	}()

	cache, err := cache.NewRedisCache(&conf.Redis)
	if err != nil {
		logger.Error("Failed to create Redis client", "error", err)
		os.Exit(1)
	}
	defer cache.Close()

	// Pass MongoDB handle to the HTTP server. Client lifecycle is managed above.
	server := http.NewServer(conf, mongoDB, logger)
	return server.Start()
}
