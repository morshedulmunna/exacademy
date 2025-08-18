package user

import (
	"context"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository provides CRUD operations for the user collection.
type Repository struct {
	db *mongo.Database
}

// NewRepository creates a new user repository.
func NewRepository(db *mongo.Database) *Repository {
	return &Repository{db: db}
}

func (r *Repository) collection() *mongo.Collection {
	return r.db.Collection(useCollection())
}

// Create inserts a new user document.
func (r *Repository) Create(ctx context.Context, u *User) (*User, error) {
	if u == nil {
		return nil, errors.New("nil user")
	}
	now := time.Now().UTC()
	if u.CreatedAt.IsZero() {
		u.CreatedAt = now
	}
	u.UpdatedAt = u.CreatedAt
	res, err := r.collection().InsertOne(ctx, u)
	if err != nil {
		return nil, err
	}
	if oid, ok := res.InsertedID.(primitive.ObjectID); ok {
		u.ID = oid
	}
	return u, nil
}

// GetByID returns a user by ObjectID.
func (r *Repository) GetByID(ctx context.Context, id primitive.ObjectID) (*User, error) {
	var out User
	if err := r.collection().FindOne(ctx, bson.M{"_id": id}).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

// GetByUUID returns a user by the linked SQL UUID string.
func (r *Repository) GetByUUID(ctx context.Context, uuid string) (*User, error) {
	var out User
	if err := r.collection().FindOne(ctx, bson.M{"user_uuid": uuid}).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

// GetByEmail returns a user by email.
func (r *Repository) GetByEmail(ctx context.Context, email string) (*User, error) {
	var out User
	if err := r.collection().FindOne(ctx, bson.M{"email": email}).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

// GetByUsername returns a user by username.
func (r *Repository) GetByUsername(ctx context.Context, username string) (*User, error) {
	var out User
	if err := r.collection().FindOne(ctx, bson.M{"username": username}).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

// Update applies partial updates and sets updated_at.
func (r *Repository) Update(ctx context.Context, id primitive.ObjectID, update bson.M) (*User, error) {
	if update == nil {
		update = bson.M{}
	}
	update["updated_at"] = time.Now().UTC()
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	var out User
	if err := r.collection().FindOneAndUpdate(ctx, bson.M{"_id": id}, bson.M{"$set": update}, opts).Decode(&out); err != nil {
		return nil, err
	}
	return &out, nil
}

// SoftDelete marks a user as deleted and inactive.
func (r *Repository) SoftDelete(ctx context.Context, id primitive.ObjectID) error {
	now := time.Now().UTC()
	_, err := r.collection().UpdateByID(ctx, id, bson.M{"$set": bson.M{"deleted_at": &now, "is_active": false, "updated_at": now}})
	return err
}

// List returns users with pagination and optional filters.
func (r *Repository) List(ctx context.Context, filter bson.M, limit, offset int64) ([]User, error) {
	if filter == nil {
		filter = bson.M{}
	}
	// By default exclude soft-deleted users unless caller specified a deleted_at filter
	if _, hasDeletedFilter := filter["deleted_at"]; !hasDeletedFilter {
		filter["$or"] = []bson.M{
			{"deleted_at": bson.M{"$exists": false}},
			{"deleted_at": nil},
		}
	}

	pipeline := mongo.Pipeline{
		bson.D{{Key: "$match", Value: filter}},
		bson.D{{Key: "$sort", Value: bson.D{{Key: "created_at", Value: -1}}}},
		bson.D{{Key: "$skip", Value: offset}},
		bson.D{{Key: "$limit", Value: limit}},
	}

	curs, err := r.collection().Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer curs.Close(ctx)
	var users []User
	for curs.Next(ctx) {
		var u User
		if err := curs.Decode(&u); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	if err := curs.Err(); err != nil {
		return nil, err
	}
	return users, nil
}
