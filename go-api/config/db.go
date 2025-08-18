package config

import (
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// NewPostgresDB creates and returns a new sqlx.DB connection using the Postgres config.
func NewPostgresDB() (*sqlx.DB, error) {
	cfg := GetConfig()

	// Use the GetDatabaseURL method which handles SSL configuration properly
	connStr := cfg.GetDatabaseURL()
	if connStr == "" {
		return nil, fmt.Errorf("no database configuration found - check POSTGRES_* environment variables")
	}

	db, err := sqlx.Connect("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	db.SetMaxOpenConns(int(cfg.Database.MaxPoolSize))
	db.SetMaxIdleConns(int(cfg.Database.MinPoolSize))
	db.SetConnMaxIdleTime(time.Duration(cfg.Database.MaxConnIdleTimeInMs) * time.Millisecond) // 5 minutes

	err = db.Ping()
	if err != nil {
		fmt.Printf("Database connection failed: %v\n", err)
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}
	fmt.Println("Database connection successful")
	return db, nil
}
