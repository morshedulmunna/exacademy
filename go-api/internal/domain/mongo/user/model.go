package user

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// User represents a user document stored in MongoDB.
// Note: This mirrors core properties of the SQL user while allowing document-first extensions.
type User struct {
	ID                   primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email                string             `bson:"email" json:"email"`
	Username             string             `bson:"username" json:"username"`
	PasswordHash         string             `bson:"password_hash,omitempty" json:"-"`
	FirstName            string             `bson:"first_name,omitempty" json:"first_name,omitempty"`
	LastName             string             `bson:"last_name,omitempty" json:"last_name,omitempty"`
	FullName             string             `bson:"full_name,omitempty" json:"full_name,omitempty"`
	Phone                string             `bson:"phone,omitempty" json:"phone,omitempty"`
	ProfilePic           string             `bson:"profile_pic,omitempty" json:"profile_pic,omitempty"`
	About                string             `bson:"about,omitempty" json:"about,omitempty"`
	Provider             string             `bson:"provider,omitempty" json:"provider,omitempty"`
	ProviderID           string             `bson:"provider_id,omitempty" json:"provider_id,omitempty"`
	IsEmailVerified      bool               `bson:"is_email_verified" json:"is_email_verified"`
	IsActive             bool               `bson:"is_active" json:"is_active"`
	HasAccess            bool               `bson:"has_access" json:"has_access"`
	TwoFactorEnabled     bool               `bson:"two_factor_enabled" json:"two_factor_enabled"`
	TwoFactorSecret      string             `bson:"two_factor_secret,omitempty" json:"-"`
	TwoFactorBackupCodes []string           `bson:"two_factor_backup_codes,omitempty" json:"-"`
	Roles                []string           `bson:"roles" json:"roles"`
	CreatedAt            time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt            time.Time          `bson:"updated_at" json:"updated_at"`
	DeletedAt            *time.Time         `bson:"deleted_at,omitempty" json:"deleted_at,omitempty"`
	Metadata             map[string]any     `bson:"metadata,omitempty" json:"metadata,omitempty"`
}

// EnsureUserIndexes declares required unique and supporting indexes for users collection.
func EnsureUserIndexes(ctx context.Context, db *mongo.Database) error {
	coll := db.Collection(useCollection())
	models := []mongo.IndexModel{
		{Keys: bson.D{{Key: "email", Value: 1}}, Options: options.Index().SetUnique(true).SetName("uniq_email")},
		{Keys: bson.D{{Key: "username", Value: 1}}, Options: options.Index().SetUnique(true).SetName("uniq_username")},
		{Keys: bson.D{{Key: "phone", Value: 1}}, Options: options.Index().SetUnique(true).SetName("uniq_phone")},
		{Keys: bson.D{{Key: "is_active", Value: 1}}, Options: options.Index().SetName("idx_active")},
		{Keys: bson.D{{Key: "created_at", Value: -1}}, Options: options.Index().SetName("idx_created_at_desc")},
	}
	_, err := coll.Indexes().CreateMany(ctx, models)
	return err
}

// CollectionName returns the MongoDB collection name for users.
func useCollection() string { return "users" }

// ParseObjectID parses a hex string to MongoDB ObjectID.
func ParseObjectID(hex string) (primitive.ObjectID, error) {
	return primitive.ObjectIDFromHex(hex)
}
