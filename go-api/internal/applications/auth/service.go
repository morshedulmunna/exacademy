package auth

import (
	"execute_academy/internal/domain/mongo/user"
)

// Service provides authentication-related operations.
// It encapsulates password hashing/verification and JWT token creation.
type Service struct {
	repo *user.Repository
}

// NewService constructs a new Service instance.
func NewService(repo *user.Repository) *Service {
	return &Service{repo: repo}
}
