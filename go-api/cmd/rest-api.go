package cmd

import (
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

	db, err := config.NewPostgresDB()
	if err != nil {
		logger.Error("Failed to connect to database", "error", err)
		os.Exit(1)
	}

	cache, err := cache.NewRedisCache(&conf.Redis)
	if err != nil {
		logger.Error("Failed to create Redis client", "error", err)
		os.Exit(1)
	}
	defer cache.Close()

	server := http.NewServer(conf, db, logger)
	return server.Start()
}
