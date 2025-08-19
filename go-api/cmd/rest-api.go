package cmd

import (
	"execute_academy/config"
	mongoindexes "execute_academy/internal/domain/mongo"
	"execute_academy/internal/interfaces/http"
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

	// Ensure MongoDB indexes on startup
	if db := mongoConn.Database(); db != nil {
		if err := mongoindexes.EnsureMongoIndexes(db); err != nil {
			// In development, log and continue to avoid blocking local runs without auth
			if conf.IsDevelopment() {
				logger.Warn("Failed to ensure MongoDB indexes (dev mode, continuing)", "error", err)
			} else {
				logger.Error("Failed to ensure MongoDB indexes", "error", err)
				os.Exit(1)
			}
		}
	}

	// Pass MongoDB handle to the HTTP server. Client lifecycle is managed above.
	server := http.NewServer(conf, mongoConn.Database(), logger)
	return server.Start()
}
