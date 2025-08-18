package email

import (
	"context"
	"log/slog"

	"skoolz/config"
	"skoolz/pkg/messaging"
)

// ExampleUsage demonstrates how to use the email service
func ExampleUsage() {
	// Load configuration
	cfg := config.GetConfig()

	// Create logger
	logger := slog.Default()

	// Initialize messaging factory

	// Get Kafka client (for queue functionality)
	kafka, err := messaging.NewKafkaClient(&cfg.Kafka, logger)
	if err != nil {
		logger.Error("Failed to create Kafka client", "error", err.Error())
		return
	}

	// Create email service
	emailConfig := EmailConfigFromAppConfig(cfg)
	emailService, err := NewEmailService(emailConfig, logger, kafka, nil)
	if err != nil {
		logger.Error("Failed to create email service", "error", err.Error())
		return
	}

	// Example 1: Send welcome email immediately
	sendWelcomeEmail(emailService)

	// Example 2: Queue password reset email
	queuePasswordResetEmail(emailService)

	// Example 3: Process email queue (run this in a separate goroutine)
	go processEmailQueue(emailService)
}

// sendWelcomeEmail demonstrates sending an email immediately
func sendWelcomeEmail(emailService *EmailService) {
	ctx := context.Background()

	// Create email request
	req := &EmailRequest{
		To:           []string{"user@example.com"},
		Subject:      "Welcome to Skoolz!",
		TemplateName: "welcome",
		TemplateData: map[string]interface{}{
			"Name":             "John Doe",
			"Email":            "user@example.com",
			"VerificationLink": "https://skoolz.com/verify?token=abc123",
		},
		Priority: 2, // Normal priority
	}

	// Send email immediately
	response, err := emailService.SendEmail(ctx, req)
	if err != nil {
		slog.Error("Failed to send welcome email", "error", err.Error())
		return
	}

	slog.Info("Welcome email sent", "id", response.ID, "status", response.Status)
}

// queuePasswordResetEmail demonstrates queuing an email for later processing
func queuePasswordResetEmail(emailService *EmailService) {
	ctx := context.Background()

	// Create email request
	req := &EmailRequest{
		To:           []string{"user@example.com"},
		Subject:      "Password Reset Request",
		TemplateName: "password-reset",
		TemplateData: map[string]interface{}{
			"Name":       "John Doe",
			"Email":      "user@example.com",
			"ResetLink":  "https://skoolz.com/reset-password?token=xyz789",
			"ExpiryTime": "24",
		},
		Priority: 1, // High priority
	}

	// Queue email for later processing
	err := emailService.QueueEmail(ctx, req)
	if err != nil {
		slog.Error("Failed to queue password reset email", "error", err.Error())
		return
	}

	slog.Info("Password reset email queued", "id", req.ID)
}

// processEmailQueue demonstrates processing queued emails
func processEmailQueue(emailService *EmailService) {
	ctx := context.Background()

	// Process email queue (this will run continuously until context is cancelled)
	err := emailService.ProcessEmailQueue(ctx)
	if err != nil {
		slog.Error("Email queue processing failed", "error", err.Error())
	}
}

// ExampleWithCustomTemplate demonstrates using a custom notification template
func ExampleWithCustomTemplate(emailService *EmailService) {
	ctx := context.Background()

	// Create email request with custom notification data
	req := &EmailRequest{
		To:           []string{"user@example.com"},
		Cc:           []string{"manager@example.com"},
		Subject:      "New Course Assignment",
		TemplateName: "notification",
		TemplateData: map[string]interface{}{
			"Name":           "John Doe",
			"Email":          "user@example.com",
			"Title":          "New Course Assignment",
			"Message":        "You have been assigned to a new course.",
			"Details":        "Course: Advanced Mathematics\nDuration: 12 weeks\nStart Date: 2024-01-15",
			"ActionLink":     "https://skoolz.com/courses/123",
			"ActionText":     "View Course",
			"AdditionalInfo": "Please complete the course within the specified timeframe.",
		},
		Priority: 2,
	}

	// Send email
	response, err := emailService.SendEmail(ctx, req)
	if err != nil {
		slog.Error("Failed to send notification email", "error", err.Error())
		return
	}

	slog.Info("Notification email sent", "id", response.ID, "status", response.Status)
}

// ExampleBatchEmails demonstrates sending multiple emails efficiently
func ExampleBatchEmails(emailService *EmailService) {
	ctx := context.Background()

	// List of recipients
	recipients := []string{
		"user1@example.com",
		"user2@example.com",
		"user3@example.com",
	}

	// Send emails to multiple recipients
	for _, recipient := range recipients {
		req := &EmailRequest{
			To:           []string{recipient},
			Subject:      "System Maintenance Notice",
			TemplateName: "notification",
			TemplateData: map[string]interface{}{
				"Name":    "User",
				"Email":   recipient,
				"Title":   "System Maintenance Notice",
				"Message": "Our system will be under maintenance on Sunday, 2:00 AM - 6:00 AM EST.",
				"Details": "During this time, the platform will be temporarily unavailable. We apologize for any inconvenience.",
			},
			Priority: 3, // Low priority
		}

		// Queue email for batch processing
		err := emailService.QueueEmail(ctx, req)
		if err != nil {
			slog.Error("Failed to queue maintenance email", "recipient", recipient, "error", err.Error())
			continue
		}

		slog.Info("Maintenance email queued", "recipient", recipient, "id", req.ID)
	}
}
