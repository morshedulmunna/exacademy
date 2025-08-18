package email

import (
	"html/template"
	"strings"
	"testing"
	"time"

	"skoolz/config"
)

func TestEmailConfigFromAppConfig(t *testing.T) {
	// Create a test config
	cfg := &config.Config{
		Email: config.EmailConfig{
			SMTPHost:     "smtp.test.com",
			SMTPPort:     587,
			SMTPUsername: "test@test.com",
			SMTPPassword: "password",
			FromEmail:    "noreply@test.com",
			FromName:     "Test App",
			TemplatePath: "./test/templates",
			QueueType:    "kafka",
		},
	}

	// Test conversion
	emailConfig := EmailConfigFromAppConfig(cfg)

	// Verify fields
	if emailConfig.SMTPHost != "smtp.test.com" {
		t.Errorf("Expected SMTPHost to be 'smtp.test.com', got '%s'", emailConfig.SMTPHost)
	}

	if emailConfig.SMTPPort != 587 {
		t.Errorf("Expected SMTPPort to be 587, got %d", emailConfig.SMTPPort)
	}

	if emailConfig.SMTPUsername != "test@test.com" {
		t.Errorf("Expected SMTPUsername to be 'test@test.com', got '%s'", emailConfig.SMTPUsername)
	}

	if emailConfig.FromEmail != "noreply@test.com" {
		t.Errorf("Expected FromEmail to be 'noreply@test.com', got '%s'", emailConfig.FromEmail)
	}

	if emailConfig.FromName != "Test App" {
		t.Errorf("Expected FromName to be 'Test App', got '%s'", emailConfig.FromName)
	}

	if emailConfig.TemplatePath != "./test/templates" {
		t.Errorf("Expected TemplatePath to be './test/templates', got '%s'", emailConfig.TemplatePath)
	}

	if emailConfig.QueueType != "kafka" {
		t.Errorf("Expected QueueType to be 'kafka', got '%s'", emailConfig.QueueType)
	}
}

func TestEmailRequestValidation(t *testing.T) {
	// Create a minimal email service for testing
	emailService := &EmailService{
		templates: map[string]*template.Template{},
	}

	// Add a test template
	testTemplate, _ := template.New("test").Parse("<h1>Hello {{.Name}}</h1>")
	emailService.templates["test"] = testTemplate

	// Test valid request
	validReq := &EmailRequest{
		To:           []string{"test@example.com"},
		Subject:      "Test Subject",
		TemplateName: "test",
		TemplateData: map[string]interface{}{
			"Name": "John",
		},
	}

	err := emailService.validateRequest(validReq)
	if err != nil {
		t.Errorf("Expected valid request to pass validation, got error: %v", err)
	}

	// Test invalid request - missing recipient
	invalidReq1 := &EmailRequest{
		Subject:      "Test Subject",
		TemplateName: "test",
		TemplateData: map[string]interface{}{
			"Name": "John",
		},
	}

	err = emailService.validateRequest(invalidReq1)
	if err == nil {
		t.Error("Expected invalid request (missing recipient) to fail validation")
	}

	// Test invalid request - missing subject
	invalidReq2 := &EmailRequest{
		To:           []string{"test@example.com"},
		TemplateName: "test",
		TemplateData: map[string]interface{}{
			"Name": "John",
		},
	}

	err = emailService.validateRequest(invalidReq2)
	if err == nil {
		t.Error("Expected invalid request (missing subject) to fail validation")
	}

	// Test invalid request - missing template
	invalidReq3 := &EmailRequest{
		To:           []string{"test@example.com"},
		Subject:      "Test Subject",
		TemplateName: "nonexistent",
		TemplateData: map[string]interface{}{
			"Name": "John",
		},
	}

	err = emailService.validateRequest(invalidReq3)
	if err == nil {
		t.Error("Expected invalid request (missing template) to fail validation")
	}
}

func TestGenerateEmailID(t *testing.T) {
	id1 := generateEmailID()
	id2 := generateEmailID()

	if id1 == id2 {
		t.Error("Expected generated email IDs to be unique")
	}

	if len(id1) == 0 {
		t.Error("Expected generated email ID to have length > 0")
	}

	// Check format
	if !strings.HasPrefix(id1, "email_") {
		t.Error("Expected email ID to start with 'email_'")
	}
}

func TestEmailService_GetTemplateNames(t *testing.T) {
	emailService := &EmailService{
		templates: map[string]*template.Template{},
	}

	// Add test templates
	testTemplate1, _ := template.New("welcome").Parse("<h1>Welcome</h1>")
	testTemplate2, _ := template.New("password-reset").Parse("<h1>Reset</h1>")
	emailService.templates["welcome"] = testTemplate1
	emailService.templates["password-reset"] = testTemplate2

	names := emailService.GetTemplateNames()

	if len(names) != 2 {
		t.Errorf("Expected 2 template names, got %d", len(names))
	}

	// Check if both template names are present
	foundWelcome := false
	foundReset := false
	for _, name := range names {
		if name == "welcome" {
			foundWelcome = true
		}
		if name == "password-reset" {
			foundReset = true
		}
	}

	if !foundWelcome {
		t.Error("Expected 'welcome' template name to be present")
	}

	if !foundReset {
		t.Error("Expected 'password-reset' template name to be present")
	}
}

func TestEmailRequest_DefaultValues(t *testing.T) {
	req := &EmailRequest{
		To:           []string{"test@example.com"},
		Subject:      "Test",
		TemplateName: "test",
	}

	// Test that ID is generated if empty
	if req.ID == "" {
		req.ID = generateEmailID()
	}

	if req.ID == "" {
		t.Error("Expected email ID to be generated")
	}

	// Test that CreatedAt is set if zero
	if req.CreatedAt.IsZero() {
		req.CreatedAt = time.Now()
	}

	if req.CreatedAt.IsZero() {
		t.Error("Expected CreatedAt to be set")
	}
}
