package cmd

import (
	"execute_academy/config"
	"execute_academy/internal/interfaces/http"
	"execute_academy/pkg/cache"
	Conncet_db "execute_academy/pkg/db"
	"execute_academy/pkg/logger"
	"os"

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
	mongoConn, err := Conncet_db.NewMongoFromConfig()
	if err != nil {
		logger.Error("Failed to connect to MongoDB", "error", err)
		os.Exit(1)
	}
	defer mongoConn.Close()

	cache, err := cache.NewRedisCache(&conf.Redis)
	if err != nil {
		logger.Error("Failed to create Redis client", "error", err)
		os.Exit(1)
	}
	defer cache.Close()

	// Pass MongoDB handle to the HTTP server. Client lifecycle is managed above.
	server := http.NewServer(conf, mongoConn.Database(), logger)
	return server.Start()
}
