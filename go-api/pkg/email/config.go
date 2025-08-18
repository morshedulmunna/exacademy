package email

import (
	"skoolz/config"
)

// EmailConfigFromAppConfig creates EmailConfig from the main application config
func EmailConfigFromAppConfig(cfg *config.Config) *EmailConfig {
	return &EmailConfig{
		SMTPHost:     cfg.Email.SMTPHost,
		SMTPPort:     cfg.Email.SMTPPort,
		SMTPUsername: cfg.Email.SMTPUsername,
		SMTPPassword: cfg.Email.SMTPPassword,
		FromEmail:    cfg.Email.FromEmail,
		FromName:     cfg.Email.FromName,
		TemplatePath: cfg.Email.TemplatePath,
		QueueType:    cfg.Email.QueueType,
	}
}
