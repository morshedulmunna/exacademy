package auth

import (
	"context"
	"time"

	Authtypes "execute_academy/internal/applications/auth/types"
	"execute_academy/internal/domain/mongo/user"
	"execute_academy/pkg/shared/utils"
)

// Register creates a new user with a hashed password.
func (s *Service) Register(ctx context.Context, in Authtypes.RegisterInput) (*user.User, error) {
	passwordHash, err := utils.HashPassword(in.Password)
	if err != nil {
		return nil, err
	}

	u := &user.User{
		Email:        in.Email,
		Username:     in.Username,
		PasswordHash: passwordHash,
		FirstName:    in.FirstName,
		LastName:     in.LastName,
		FullName:     in.FirstName + " " + in.LastName,
		IsActive:     true,
		HasAccess:    true,
		Roles:        []string{"user"},
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
	}

	return s.repo.Create(ctx, u)
}
