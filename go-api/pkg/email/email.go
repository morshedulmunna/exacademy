package email

import (
	"bytes"
	"context"
	"encoding/json"
	"execute_academy/pkg/messaging"
	"fmt"
	"html/template"
	"log/slog"
	"net/smtp"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

// EmailConfig represents email service configuration
type EmailConfig struct {
	SMTPHost     string `envconfig:"SMTP_HOST" default:"localhost"`
	SMTPPort     int    `envconfig:"SMTP_PORT" default:"587"`
	SMTPUsername string `envconfig:"SMTP_USERNAME"`
	SMTPPassword string `envconfig:"SMTP_PASSWORD"`
	FromEmail    string `envconfig:"FROM_EMAIL" default:"noreply@execute_academy.com"`
	FromName     string `envconfig:"FROM_NAME" default:"execute_academy"`
	TemplatePath string `envconfig:"EMAIL_TEMPLATE_PATH" default:"./templates/email"`
	QueueType    string `envconfig:"EMAIL_QUEUE_TYPE" default:"kafka"` // kafka or nats
}

// EmailRequest represents an email request
type EmailRequest struct {
	ID           string                 `json:"id"`
	To           []string               `json:"to"`
	Cc           []string               `json:"cc,omitempty"`
	Bcc          []string               `json:"bcc,omitempty"`
	Subject      string                 `json:"subject"`
	TemplateName string                 `json:"template_name"`
	TemplateData map[string]interface{} `json:"template_data"`
	Priority     int                    `json:"priority"` // 1=high, 2=normal, 3=low
	RetryCount   int                    `json:"retry_count"`
	CreatedAt    time.Time              `json:"created_at"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}

// EmailResponse represents an email response
type EmailResponse struct {
	ID         string    `json:"id"`
	Status     string    `json:"status"` // sent, failed, queued
	Message    string    `json:"message,omitempty"`
	SentAt     time.Time `json:"sent_at,omitempty"`
	Error      string    `json:"error,omitempty"`
	RetryCount int       `json:"retry_count"`
}

// EmailService represents the email service
type EmailService struct {
	config      *EmailConfig
	logger      *slog.Logger
	kafkaClient *messaging.KafkaClient
	templates   map[string]*template.Template
}

// NewEmailService creates a new email service
func NewEmailService(cfg *EmailConfig, log *slog.Logger, kafkaClient *messaging.KafkaClient, natsClient *messaging.NatsClient) (*EmailService, error) {
	service := &EmailService{
		config:      cfg,
		logger:      log,
		kafkaClient: kafkaClient,
		templates:   make(map[string]*template.Template),
	}

	// Load email templates
	if err := service.loadTemplates(); err != nil {
		return nil, fmt.Errorf("failed to load email templates: %w", err)
	}

	return service, nil
}

// loadTemplates loads all email templates from the template directory
func (e *EmailService) loadTemplates() error {
	templateDir := e.config.TemplatePath
	if templateDir == "" {
		templateDir = "./templates/email"
	}

	// Create template directory if it doesn't exist
	if err := os.MkdirAll(templateDir, 0755); err != nil {
		return fmt.Errorf("failed to create template directory: %w", err)
	}

	// Walk through template directory
	err := filepath.Walk(templateDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories and non-html files
		if info.IsDir() || !strings.HasSuffix(info.Name(), ".html") {
			return nil
		}

		// Read template file
		content, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("failed to read template file %s: %w", path, err)
		}

		// Parse template
		tmpl, err := template.New(info.Name()).Parse(string(content))
		if err != nil {
			return fmt.Errorf("failed to parse template %s: %w", path, err)
		}

		// Store template with filename as key
		templateName := strings.TrimSuffix(info.Name(), ".html")
		e.templates[templateName] = tmpl

		e.logger.Info("Loaded email template", "name", templateName, "path", path)
		return nil
	})

	if err != nil {
		return fmt.Errorf("failed to walk template directory: %w", err)
	}

	e.logger.Info("Email templates loaded", "count", len(e.templates))
	return nil
}

// SendEmail sends an email immediately
func (e *EmailService) SendEmail(ctx context.Context, req *EmailRequest) (*EmailResponse, error) {
	// Validate request
	if err := e.validateRequest(req); err != nil {
		return nil, fmt.Errorf("invalid email request: %w", err)
	}

	// Generate email ID if not provided
	if req.ID == "" {
		req.ID = generateEmailID()
	}

	// Set creation time if not set
	if req.CreatedAt.IsZero() {
		req.CreatedAt = time.Now()
	}

	// Render email content
	htmlContent, textContent, err := e.renderEmail(req)
	if err != nil {
		return nil, fmt.Errorf("failed to render email: %w", err)
	}

	// Send email via SMTP
	if err := e.sendViaSMTP(req, htmlContent, textContent); err != nil {
		response := &EmailResponse{
			ID:         req.ID,
			Status:     "failed",
			Error:      err.Error(),
			RetryCount: req.RetryCount,
		}
		return response, err
	}

	response := &EmailResponse{
		ID:         req.ID,
		Status:     "sent",
		SentAt:     time.Now(),
		RetryCount: req.RetryCount,
	}

	e.logger.Info("Email sent successfully", "id", req.ID, "to", req.To, "subject", req.Subject)
	return response, nil
}

// QueueEmail queues an email for later sending
func (e *EmailService) QueueEmail(ctx context.Context, req *EmailRequest) error {
	// Validate request
	if err := e.validateRequest(req); err != nil {
		return fmt.Errorf("invalid email request: %w", err)
	}

	// Generate email ID if not provided
	if req.ID == "" {
		req.ID = generateEmailID()
	}

	// Set creation time if not set
	if req.CreatedAt.IsZero() {
		req.CreatedAt = time.Now()
	}

	// Queue based on configuration
	switch strings.ToLower(e.config.QueueType) {
	case "kafka":
		if e.kafkaClient == nil {
			return fmt.Errorf("kafka client not available")
		}
		return e.kafkaClient.PublishMessage(ctx, "email-requests", req.ID, req, nil)

	default:
		return fmt.Errorf("unsupported queue type: %s", e.config.QueueType)
	}
}

// ProcessEmailQueue processes queued emails
func (e *EmailService) ProcessEmailQueue(ctx context.Context) error {
	switch strings.ToLower(e.config.QueueType) {
	case "kafka":
		return e.processKafkaQueue(ctx)

	default:
		return fmt.Errorf("unsupported queue type: %s", e.config.QueueType)
	}
}

// processKafkaQueue processes emails from Kafka queue
func (e *EmailService) processKafkaQueue(ctx context.Context) error {
	if e.kafkaClient == nil {
		return fmt.Errorf("kafka client not available")
	}

	return e.kafkaClient.Subscribe(ctx, "email-requests", func(msg messaging.KafkaMessage) error {
		var req EmailRequest
		if err := json.Unmarshal([]byte(msg.Value.(string)), &req); err != nil {
			e.logger.Error("Failed to unmarshal email request", "error", err.Error())
			return err
		}

		// Process email
		response, err := e.SendEmail(ctx, &req)
		if err != nil {
			e.logger.Error("Failed to send email", "id", req.ID, "error", err.Error())
			return err
		}

		e.logger.Info("Email processed from queue", "id", response.ID, "status", response.Status)
		return nil
	})
}

// validateRequest validates an email request
func (e *EmailService) validateRequest(req *EmailRequest) error {
	if len(req.To) == 0 {
		return fmt.Errorf("recipient email is required")
	}

	if req.Subject == "" {
		return fmt.Errorf("email subject is required")
	}

	if req.TemplateName == "" {
		return fmt.Errorf("template name is required")
	}

	if _, exists := e.templates[req.TemplateName]; !exists {
		return fmt.Errorf("template '%s' not found", req.TemplateName)
	}

	return nil
}

// renderEmail renders email content using templates
func (e *EmailService) renderEmail(req *EmailRequest) (string, string, error) {
	tmpl, exists := e.templates[req.TemplateName]
	if !exists {
		return "", "", fmt.Errorf("template '%s' not found", req.TemplateName)
	}

	// Render HTML content
	var htmlBuffer bytes.Buffer
	if err := tmpl.Execute(&htmlBuffer, req.TemplateData); err != nil {
		return "", "", fmt.Errorf("failed to render HTML template: %w", err)
	}

	// For now, use HTML content as text content (you can implement a separate text template)
	textContent := htmlBuffer.String()

	return htmlBuffer.String(), textContent, nil
}

// sendViaSMTP sends email via SMTP
func (e *EmailService) sendViaSMTP(req *EmailRequest, htmlContent, textContent string) error {
	// SMTP authentication
	auth := smtp.PlainAuth("", e.config.SMTPUsername, e.config.SMTPPassword, e.config.SMTPHost)

	// Prepare email headers
	headers := make(map[string]string)
	headers["From"] = fmt.Sprintf("%s <%s>", e.config.FromName, e.config.FromEmail)
	headers["To"] = strings.Join(req.To, ", ")
	if len(req.Cc) > 0 {
		headers["Cc"] = strings.Join(req.Cc, ", ")
	}
	headers["Subject"] = req.Subject
	headers["MIME-Version"] = "1.0"
	headers["Content-Type"] = "text/html; charset=UTF-8"

	// Build email message
	var message bytes.Buffer
	for key, value := range headers {
		message.WriteString(fmt.Sprintf("%s: %s\r\n", key, value))
	}
	message.WriteString("\r\n")
	message.WriteString(htmlContent)

	// Send email
	addr := fmt.Sprintf("%s:%d", e.config.SMTPHost, e.config.SMTPPort)
	recipients := append(req.To, req.Cc...)
	recipients = append(recipients, req.Bcc...)

	return smtp.SendMail(addr, auth, e.config.FromEmail, recipients, message.Bytes())
}

// generateEmailID generates a unique email ID
func generateEmailID() string {
	return fmt.Sprintf("email_%s", uuid.NewString())
}

// GetTemplateNames returns all available template names
func (e *EmailService) GetTemplateNames() []string {
	names := make([]string, 0, len(e.templates))
	for name := range e.templates {
		names = append(names, name)
	}
	return names
}

// ReloadTemplates reloads all email templates
func (e *EmailService) ReloadTemplates() error {
	e.templates = make(map[string]*template.Template)
	return e.loadTemplates()
}
