package user

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// User represents a user document stored in MongoDB.
// Note: This mirrors core properties of the SQL user while allowing document-first extensions.
type User struct {
	ID                   primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserUUID             string             `bson:"user_uuid" json:"user_uuid"`
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

// CollectionName returns the MongoDB collection name for users.
func CollectionName() string { return "users" }
