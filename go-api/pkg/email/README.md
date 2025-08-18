# Email Service Package

A comprehensive email service package for the Skoolz application that supports both immediate email sending and queue-based processing using Kafka or NATS.

## Features

- **Template-based emails**: HTML email templates with dynamic content
- **Queue system support**: Kafka and NATS integration for asynchronous email processing
- **SMTP integration**: Direct SMTP email sending
- **Priority handling**: Email priority levels (high, normal, low)
- **Retry mechanism**: Built-in retry logic for failed emails
- **Template hot-reload**: Ability to reload templates without restarting the service

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@skoolz.com
FROM_NAME=Skoolz
EMAIL_TEMPLATE_PATH=./pkg/email/templates
EMAIL_QUEUE_TYPE=kafka
```

### Configuration Options

| Variable              | Description               | Default              |
| --------------------- | ------------------------- | -------------------- |
| `SMTP_HOST`           | SMTP server hostname      | `localhost`          |
| `SMTP_PORT`           | SMTP server port          | `587`                |
| `SMTP_USERNAME`       | SMTP username             | -                    |
| `SMTP_PASSWORD`       | SMTP password             | -                    |
| `FROM_EMAIL`          | Default sender email      | `noreply@skoolz.com` |
| `FROM_NAME`           | Default sender name       | `Skoolz`             |
| `EMAIL_TEMPLATE_PATH` | Path to email templates   | `./templates/email`  |
| `EMAIL_QUEUE_TYPE`    | Queue system (kafka/nats) | `kafka`              |

## Usage

### Basic Setup

```go
package main

import (
    "context"
    "log/slog"

    "execute_academy/config"
    "execute_academy/internal/infrastructure/messaging"
    "execute_academy/pkg/email"
)

func main() {
    // Load configuration
    cfg := config.GetConfig()

    // Create logger
    logger := slog.Default()

    // Initialize messaging factory
    messagingFactory := messaging.NewMessagingFactory(cfg, logger)

    // Get Kafka client
    kafkaClient, err := messagingFactory.GetKafkaClient()
    if err != nil {
        logger.Error("Failed to create Kafka client", "error", err.Error())
        return
    }

    // Create email service
    emailConfig := email.EmailConfigFromAppConfig(cfg)
    emailService, err := email.NewEmailService(emailConfig, logger, kafkaClient, nil)
    if err != nil {
        logger.Error("Failed to create email service", "error", err.Error())
        return
    }

    // Start email queue processor
    go func() {
        ctx := context.Background()
        if err := emailService.ProcessEmailQueue(ctx); err != nil {
            logger.Error("Email queue processing failed", "error", err.Error())
        }
    }()
}
```

### Sending Emails Immediately

```go
func sendWelcomeEmail(emailService *email.EmailService) {
    ctx := context.Background()

    req := &email.EmailRequest{
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

    response, err := emailService.SendEmail(ctx, req)
    if err != nil {
        log.Error("Failed to send email", "error", err.Error())
        return
    }

    log.Info("Email sent", "id", response.ID, "status", response.Status)
}
```

### Queuing Emails for Later Processing

```go
func queuePasswordResetEmail(emailService *email.EmailService) {
    ctx := context.Background()

    req := &email.EmailRequest{
        To:           []string{"user@example.com"},
        Subject:      "Password Reset Request",
        TemplateName: "password-reset",
        TemplateData: map[string]interface{}{
            "Name":        "John Doe",
            "Email":       "user@example.com",
            "ResetLink":   "https://skoolz.com/reset-password?token=xyz789",
            "ExpiryTime":  "24",
        },
        Priority: 1, // High priority
    }

    err := emailService.QueueEmail(ctx, req)
    if err != nil {
        log.Error("Failed to queue email", "error", err.Error())
        return
    }

    log.Info("Email queued", "id", req.ID)
}
```

## Email Templates

### Template Structure

Email templates are HTML files stored in the template directory. The service automatically loads all `.html` files from the configured template path.

### Template Variables

Templates use Go's `html/template` package and support dynamic content through template variables.

#### Welcome Template Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Skoolz</title>
  </head>
  <body>
    <h1>Hello {{.Name}},</h1>
    <p>Welcome to Skoolz! Your account has been created with email: {{.Email}}</p>

    {{if .VerificationLink}}
    <a href="{{.VerificationLink}}">Verify Email</a>
    {{end}}
  </body>
</html>
```

### Available Templates

1. **welcome.html** - Welcome email for new users
2. **password-reset.html** - Password reset emails
3. **notification.html** - General notification emails

### Creating Custom Templates

1. Create a new HTML file in the template directory
2. Use Go template syntax for dynamic content
3. The filename (without .html extension) becomes the template name
4. Restart the service or call `ReloadTemplates()` to load new templates

## Email Request Structure

```go
type EmailRequest struct {
    ID           string                 // Unique email ID (auto-generated if empty)
    To           []string               // Recipient email addresses
    Cc           []string               // CC recipients (optional)
    Bcc          []string               // BCC recipients (optional)
    Subject      string                 // Email subject
    TemplateName string                 // Template name (without .html extension)
    TemplateData map[string]interface{} // Template variables
    Priority     int                    // Priority: 1=high, 2=normal, 3=low
    RetryCount   int                    // Current retry count
    CreatedAt    time.Time              // Creation timestamp
    Metadata     map[string]interface{} // Additional metadata
}
```

## Email Response Structure

```go
type EmailResponse struct {
    ID         string    // Email ID
    Status     string    // Status: sent, failed, queued
    Message    string    // Status message
    SentAt     time.Time // Timestamp when sent
    Error      string    // Error message (if failed)
    RetryCount int       // Number of retries
}
```

## Queue System

### Kafka Integration

The service supports Kafka for email queuing. Configure Kafka topics and consumer groups in your application configuration.

### NATS Integration

The service also supports NATS JetStream for email queuing. Configure NATS subjects and queue groups in your application configuration.

### Queue Processing

```go
// Start email queue processor
go func() {
    ctx := context.Background()
    err := emailService.ProcessEmailQueue(ctx)
    if err != nil {
        log.Error("Email queue processing failed", "error", err.Error())
    }
}()
```

## Error Handling

The email service includes comprehensive error handling:

- **Template errors**: Invalid templates or missing template files
- **SMTP errors**: Connection issues, authentication failures
- **Queue errors**: Message publishing/consuming failures
- **Validation errors**: Invalid email requests

## Best Practices

1. **Use templates**: Create reusable email templates instead of hardcoding HTML
2. **Queue for bulk emails**: Use the queue system for sending multiple emails
3. **Set appropriate priorities**: Use priority levels to handle urgent emails first
4. **Monitor queue processing**: Implement proper logging and monitoring
5. **Handle errors gracefully**: Always check for errors and implement retry logic
6. **Secure SMTP credentials**: Use environment variables for sensitive data

## Testing

### Unit Tests

```go
func TestEmailService_SendEmail(t *testing.T) {
    // Test email sending functionality
}

func TestEmailService_QueueEmail(t *testing.T) {
    // Test email queuing functionality
}
```

### Integration Tests

```go
func TestEmailService_Integration(t *testing.T) {
    // Test with actual SMTP server and queue system
}
```

## Monitoring and Logging

The service provides comprehensive logging:

- Template loading events
- Email sending status
- Queue processing events
- Error details and retry attempts

## Security Considerations

1. **SMTP credentials**: Store credentials securely using environment variables
2. **Template injection**: Validate template data to prevent injection attacks
3. **Rate limiting**: Implement rate limiting for email sending
4. **Email validation**: Validate email addresses before sending

## Troubleshooting

### Common Issues

1. **SMTP authentication failed**: Check SMTP credentials and server settings
2. **Template not found**: Verify template file exists and path is correct
3. **Queue connection failed**: Check Kafka/NATS configuration and connectivity
4. **Email not delivered**: Check recipient email address and SMTP server logs

### Debug Mode

Enable debug logging to get detailed information about email processing:

```go
logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelDebug,
}))
```
