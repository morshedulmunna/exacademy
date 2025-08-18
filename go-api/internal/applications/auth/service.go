package auth

import (
	"context"
	"errors"
	"time"

	"execute_academy/config"
	"execute_academy/internal/domain/mongo/user"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
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

// RegisterInput represents input data for registering a user.
type RegisterInput struct {
	Email     string
	Username  string
	Password  string
	FirstName string
	LastName  string
}

// LoginInput represents input data for logging in a user.
type LoginInput struct {
	Email    string
	Password string
}

// TokenPair represents the access token response.
type TokenPair struct {
	AccessToken string `json:"access_token"`
}

// Register creates a new user with a hashed password.
func (s *Service) Register(ctx context.Context, in RegisterInput) (*user.User, error) {
	if in.Email == "" || in.Username == "" || in.Password == "" {
		return nil, errors.New("missing required fields")
	}

	passwordHash, err := hashPassword(in.Password)
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
func (s *Service) Login(ctx context.Context, in LoginInput) (*user.User, *TokenPair, error) {
	if in.Email == "" || in.Password == "" {
		return nil, nil, errors.New("missing required fields")
	}

	u, err := s.repo.GetByEmail(ctx, in.Email)
	if err != nil {
		return nil, nil, err
	}

	if err := verifyPassword(u.PasswordHash, in.Password); err != nil {
		return nil, nil, errors.New("invalid credentials")
	}

	token, err := generateAccessToken(u)
	if err != nil {
		return nil, nil, err
	}

	return u, &TokenPair{AccessToken: token}, nil
}

func hashPassword(password string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func verifyPassword(hash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

func generateAccessToken(u *user.User) (string, error) {
	claims := jwt.MapClaims{
		"iss":       config.GetConfig().ServiceName,
		"sub":       u.ID.Hex(),
		"email":     u.Email,
		"name":      u.FullName,
		"role":      firstRole(u.Roles),
		"is_active": u.IsActive,
		"jti":       uuid.NewString(),
		"iat":       time.Now().Unix(),
		"nbf":       time.Now().Unix(),
		"exp":       time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetConfig().JwtSecret))
}

func firstRole(roles []string) string {
	if len(roles) == 0 {
		return "user"
	}
	return roles[0]
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
