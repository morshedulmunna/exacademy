package config

import (
	"context"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// NewMongoClient creates a new MongoDB client using configuration from GetConfig.
// It validates configuration, applies sensible connection pool settings, connects, and pings the server.
func NewMongoClient(ctx context.Context) (*mongo.Client, error) {
	cfg := GetConfig()
	uri := cfg.GetMongoURI()
	if uri == "" {
		return nil, errors.New("mongo configuration not found: set MONGO_URI or MONGO_HOST/PORT and related vars")
	}

	clientOptions := options.Client().ApplyURI(uri)
	if cfg.Mongo.MaxPoolSize > 0 {
		clientOptions.SetMaxPoolSize(cfg.Mongo.MaxPoolSize)
	}
	clientOptions.SetMinPoolSize(cfg.Mongo.MinPoolSize)
	if cfg.Mongo.ConnectTimeoutMs > 0 {
		clientOptions.SetConnectTimeout(time.Duration(cfg.Mongo.ConnectTimeoutMs) * time.Millisecond)
	}

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to create mongo client: %w", err)
	}

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	if err := client.Ping(pingCtx, nil); err != nil {
		_ = client.Disconnect(context.Background())
		return nil, fmt.Errorf("failed to ping mongo: %w", err)
	}

	return client, nil
}

// NewMongoDatabase creates a connected MongoDB client and returns the database handle for cfg.Mongo.Database.
// The caller is responsible for closing the returned client when done.
func NewMongoDatabase(ctx context.Context) (*mongo.Database, *mongo.Client, error) {
	cfg := GetConfig()
	if cfg.Mongo.Database == "" {
		return nil, nil, errors.New("MONGO_DATABASE is required to obtain a database handle")
	}

	client, err := NewMongoClient(ctx)
	if err != nil {
		return nil, nil, err
	}

	return client.Database(cfg.Mongo.Database), client, nil
}
