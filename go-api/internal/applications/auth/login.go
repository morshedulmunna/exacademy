package auth

import (
	"context"
	"errors"

	Authtypes "execute_academy/internal/applications/auth/types"
	"execute_academy/internal/domain/mongo/user"
	"execute_academy/pkg/shared/utils"
)

// Login verifies credentials and returns a token pair on success.
func (s *Service) Login(ctx context.Context, in Authtypes.LoginInput) (*user.User, *Authtypes.TokenPair, error) {
	u, err := s.repo.GetByEmail(ctx, in.Email)
	if err != nil {
		return nil, nil, err
	}

	if err := utils.VerifyPassword(u.PasswordHash, in.Password); err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	claims := map[string]any{
		"sub": u.ID.Hex(),
	}

	token, err := utils.GenerateTokenWithClaims(claims, nil)
	if err != nil {
		return nil, nil, err
	}

	return u, &Authtypes.TokenPair{AccessToken: token}, nil
}
