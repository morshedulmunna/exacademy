package auth

import (
	"context"
	"crypto/rand"
	"fmt"
	"time"

	Authtypes "execute_academy/internal/applications/auth/types"
	"execute_academy/internal/domain/mongo/user"
	"execute_academy/pkg/email"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/utils"
)

// generateSixDigitOTP returns a zero-padded 6-digit numeric code using crypto/rand
func generateSixDigitOTP() string {
	const digits = "0123456789"
	b := make([]byte, 6)
	for i := range b {
		var n byte
		for {
			buf := make([]byte, 1)
			_, _ = rand.Read(buf)
			n = buf[0] % 10
			break
		}
		b[i] = digits[n]
	}
	return string(b)
}

// Register creates a new user with a hashed password and triggers OTP email.
func (s *Service) Register(ctx context.Context, in Authtypes.RegisterInput) (*user.User, error) {
	passwordHash, err := utils.HashPassword(in.Password)
	if err != nil {
		return nil, err
	}

	//checking email already exist or not
	existingUser, err := s.repo.GetByEmail(ctx, in.Email)
	if err == nil && existingUser != nil {
		return nil, AppError.Conflict("User already registered")
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

	createdUser, err := s.repo.Create(ctx, u)
	if err != nil {
		return nil, err
	}

	// After successful registration, generate OTP and queue verification email
	otp := generateSixDigitOTP()
	otpKey := fmt.Sprintf("otp:register:%s", createdUser.Email)
	otpTTL := 10 * time.Minute

	if s.cache != nil {
		_ = s.cache.Set(ctx, otpKey, otp, otpTTL)
	}

	if s.email != nil {
		_ = s.email.QueueEmail(ctx, &email.EmailRequest{
			To:           []string{createdUser.Email},
			Subject:      "Your Execute Academy verification code",
			TemplateName: "otp",
			TemplateData: map[string]interface{}{
				"Name":          createdUser.FullName,
				"Email":         createdUser.Email,
				"Otp":           otp,
				"ExpiryMinutes": int(otpTTL.Minutes()),
			},
			Priority: 2,
		})
	}

	return createdUser, nil
}
