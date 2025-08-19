package auth

import (
	"context"
	"crypto/rand"
	"fmt"
	"net/http"
	"time"

	Authtypes "execute_academy/internal/applications/auth/types"
	"execute_academy/pkg/email"
	AppError "execute_academy/pkg/shared/error"
	"execute_academy/pkg/shared/response"
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

// Register handles user registration.
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var in Authtypes.RegisterInput
	utils.ParseRequestBodyWithValidation(w, r, &in)

	u, err := h.svc.Register(r.Context(), in)
	if err != nil {
		AppError.UnprocessableEntity("Registration Not Complete!")
		return
	}

	// After successful registration, generate OTP and queue verification email
	otp := generateSixDigitOTP()
	otpKey := fmt.Sprintf("otp:register:%s", u.Email)
	otpTTL := 10 * time.Minute

	if h.cache != nil {
		_ = h.cache.Set(r.Context(), otpKey, otp, otpTTL)
	}

	if h.email != nil {
		// Queue email via Kafka-backed email service
		_ = h.email.QueueEmail(context.Background(), &email.EmailRequest{
			To:           []string{u.Email},
			Subject:      "Your Execute Academy verification code",
			TemplateName: "otp",
			TemplateData: map[string]interface{}{
				"Name":          u.FullName,
				"Email":         u.Email,
				"Otp":           otp,
				"ExpiryMinutes": int(otpTTL.Minutes()),
			},
			Priority: 2,
		})
	}

	response.WriteCreated(w, "User registered", map[string]any{"user": u})
}
