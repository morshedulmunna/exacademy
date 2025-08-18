package Conncet_db

import (
	"context"
	"errors"
	"execute_academy/config"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// PostgresConnection provides a managed wrapper around a Postgres sqlx.DB connection.
// It mirrors the Mongo wrapper by exposing constructors with explicit config and from
// the global config, and small lifecycle helpers.
type PostgresConnection struct {
	db  *sqlx.DB
	cfg *config.PostgresDatabase
}

// NewPostgres creates a new managed Postgres connection from the provided config.
func NewPostgres(cfg *config.PostgresDatabase) (*PostgresConnection, error) {
	if cfg == nil {
		return nil, errors.New("nil Postgres config provided")
	}

	// Build a DSN using the existing helper on Config
	tmp := &config.Config{Database: *cfg}
	dsn := tmp.GetDatabaseURL()
	if dsn == "" {
		return nil, errors.New("postgres configuration not found: set POSTGRES_* environment variables")
	}

	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to create postgres connection: %w", err)
	}

	// Pool configuration
	if cfg.MaxPoolSize > 0 {
		db.SetMaxOpenConns(int(cfg.MaxPoolSize))
	}
	db.SetMaxIdleConns(int(cfg.MinPoolSize))
	if cfg.MaxConnIdleTimeInMs > 0 {
		db.SetConnMaxIdleTime(time.Duration(cfg.MaxConnIdleTimeInMs) * time.Millisecond)
	}

	// Verify connectivity
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("failed to ping postgres: %w", err)
	}

	return &PostgresConnection{
		db:  db,
		cfg: cfg,
	}, nil
}

// NewPostgresFromConfig creates a new managed Postgres connection using the global application config.
func NewPostgresFromConfig() (*PostgresConnection, error) {
	cfg := config.GetConfig()
	return NewPostgres(&cfg.Database)
}

// NewPostgresDB returns the underlying *sqlx.DB using the global application config.
// This mirrors NewMongoClient by providing direct access to the underlying client when needed.
func NewPostgresDB() (*sqlx.DB, error) {
	conn, err := NewPostgresFromConfig()
	if err != nil {
		return nil, err
	}
	return conn.db, nil
}

// DB returns the underlying *sqlx.DB handle.
func (p *PostgresConnection) DB() *sqlx.DB {
	return p.db
}

// Ping validates the connection is alive.
func (p *PostgresConnection) Ping(ctx context.Context) error {
	return p.db.PingContext(ctx)
}

// Close closes the underlying database connection.
func (p *PostgresConnection) Close() error {
	return p.db.Close()
}
