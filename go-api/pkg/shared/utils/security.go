package utils

import (
	"execute_academy/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword returns a bcrypt hash for the given plaintext password.
func HashPassword(password string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

// VerifyPassword compares a bcrypt hash with a plaintext password.
func VerifyPassword(hash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

// TokenOptions controls how a JWT is generated.
// TTLMinutes <= 0 falls back to configured default. Issuer empty falls back to service name.
type TokenOptions struct {
	TTLMinutes int
	Issuer     string
}

// GenerateTokenWithClaims signs a JWT using provided base claims and optional overrides.
// It will ensure standard claims (iss, jti, iat, nbf, exp) exist when missing.
// Pass nil opts to use defaults from configuration.
func GenerateTokenWithClaims(baseClaims map[string]any, opts *TokenOptions) (string, error) {
	cfg := config.GetConfig()

	issuer := cfg.ServiceName
	if opts != nil && opts.Issuer != "" {
		issuer = opts.Issuer
	}

	ttlMinutes := cfg.JwtAccessTTLMinutes
	if opts != nil && opts.TTLMinutes > 0 {
		ttlMinutes = opts.TTLMinutes
	}

	now := time.Now()
	claims := jwt.MapClaims{}
	for k, v := range baseClaims {
		claims[k] = v
	}

	if _, ok := claims["iss"]; !ok {
		claims["iss"] = issuer
	}
	if _, ok := claims["jti"]; !ok {
		claims["jti"] = uuid.NewString()
	}
	if _, ok := claims["iat"]; !ok {
		claims["iat"] = now.Unix()
	}
	if _, ok := claims["nbf"]; !ok {
		claims["nbf"] = now.Unix()
	}
	if _, ok := claims["exp"]; !ok {
		expiresAt := now.Add(time.Duration(ttlMinutes) * time.Minute)
		claims["exp"] = expiresAt.Unix()
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.JwtSecret))
}
