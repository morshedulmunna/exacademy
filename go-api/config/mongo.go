package config

import (
	"context"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// MongoConnection provides a thin, managed wrapper around the MongoDB client and database.
// It mirrors the Redis pattern by exposing a constructor with explicit config, a constructor
// using the global config, and small utility methods for lifecycle management.
type MongoConnection struct {
	client   *mongo.Client
	database *mongo.Database
	cfg      *MongoDatabase
}

// NewMongo creates a new managed Mongo connection from the provided Mongo configuration.
// It validates configuration, applies pool/timeouts, establishes the connection and pings.
func NewMongo(cfg *MongoDatabase) (*MongoConnection, error) {
	if cfg == nil {
		return nil, errors.New("nil Mongo config provided")
	}

	// Build a URI using the existing helper on Config
	tmp := &Config{Mongo: *cfg}
	uri := tmp.GetMongoURI()
	if uri == "" {
		return nil, errors.New("mongo configuration not found: set MONGO_URI or MONGO_HOST/PORT and related vars")
	}

	clientOptions := options.Client().ApplyURI(uri)
	if cfg.MaxPoolSize > 0 {
		clientOptions.SetMaxPoolSize(cfg.MaxPoolSize)
	}
	clientOptions.SetMinPoolSize(cfg.MinPoolSize)
	if cfg.ConnectTimeoutMs > 0 {
		clientOptions.SetConnectTimeout(time.Duration(cfg.ConnectTimeoutMs) * time.Millisecond)
	}

	// Connect
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to create mongo client: %w", err)
	}
	fmt.Println("MongoDb Conncet successfully")

	// Ping
	pingCtx, pingCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer pingCancel()
	if err := client.Ping(pingCtx, nil); err != nil {
		_ = client.Disconnect(context.Background())
		return nil, fmt.Errorf("failed to ping mongo: %w", err)
	}

	// Database handle (optional if Database is empty)
	var db *mongo.Database
	if cfg.Database != "" {
		db = client.Database(cfg.Database)
	}

	return &MongoConnection{
		client:   client,
		database: db,
		cfg:      cfg,
	}, nil
}

// NewMongoFromConfig creates a new managed Mongo connection using the global application config.
func NewMongoFromConfig() (*MongoConnection, error) {
	cfg := GetConfig()
	return NewMongo(&cfg.Mongo)
}

// NewMongoClient returns a raw mongo.Client using the global application config.
// This mirrors NewRedisClient by providing direct access to the underlying client when needed.
func NewMongoClient() (*mongo.Client, error) {
	conn, err := NewMongoFromConfig()
	if err != nil {
		return nil, err
	}
	return conn.client, nil
}

// Database returns the selected database handle. It can be nil if no database name was configured.
func (m *MongoConnection) Database() *mongo.Database {
	return m.database
}

// Client returns the underlying mongo.Client.
func (m *MongoConnection) Client() *mongo.Client {
	return m.client
}

// Ping validates the connection is alive.
func (m *MongoConnection) Ping(ctx context.Context) error {
	return m.client.Ping(ctx, nil)
}

// Close disconnects the underlying MongoDB client.
func (m *MongoConnection) Close() error {
	return m.client.Disconnect(context.Background())
}
