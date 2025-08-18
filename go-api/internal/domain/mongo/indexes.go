package mongoindexes

import (
	"context"
	"execute_academy/internal/domain/mongo/user"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

// EnsureMongoIndexes ensures all MongoDB collection indexes exist.
// Call this once during service startup.
func EnsureMongoIndexes(db *mongo.Database) error {
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	if err := user.EnsureUserIndexes(ctx, db); err != nil {
		return err
	}

	return nil
}
