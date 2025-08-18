package utils

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ParseHexObjectID converts a hex string into a MongoDB ObjectID.
// Returns an error if the input is not a valid ObjectID.
func ParseHexObjectID(hex string) (primitive.ObjectID, error) {
	return primitive.ObjectIDFromHex(hex)
}
