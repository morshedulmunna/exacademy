package auth

import (
	"context"
	"errors"
	"time"

	Authtypes "execute_academy/internal/applications/auth/types"
	"execute_academy/internal/domain/mongo/user"
	"execute_academy/pkg/shared/utils"
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
		FullName:     buildFullName(in.FirstName, in.LastName),
		IsActive:     true,
		HasAccess:    true,
		Roles:        []string{"user"},
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
	}

	return s.repo.Create(ctx, u)
}

// Login verifies credentials and returns a token pair on success.
func (s *Service) Login(ctx context.Context, in Authtypes.LoginInput) (*user.User, *Authtypes.TokenPair, error) {
	if in.Email == "" || in.Password == "" {
		return nil, nil, errors.New("missing required fields")
	}

	u, err := s.repo.GetByEmail(ctx, in.Email)
	if err != nil {
		return nil, nil, err
	}

	if err := utils.VerifyPassword(u.PasswordHash, in.Password); err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	claims := map[string]any{
		"sub":        u.ID.Hex(),
		"email":      u.Email,
		"username":   u.Username,
		"roles":      u.Roles,
		"name":       u.FullName,
		"is_active":  u.IsActive,
		"has_access": u.HasAccess,
	}

	token, err := utils.GenerateTokenWithClaims(claims, nil)
	if err != nil {
		return nil, nil, err
	}

	return u, &Authtypes.TokenPair{AccessToken: token}, nil
}

func buildFullName(first, last string) string {
	if first == "" && last == "" {
		return ""
	}
	if first == "" {
		return last
	}
	if last == "" {
		return first
	}
	return first + " " + last
}
