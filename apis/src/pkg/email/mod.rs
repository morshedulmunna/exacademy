use async_trait::async_trait;

/// Email message content variants.
#[derive(Debug, Clone)]
pub enum EmailContent {
    Raw {
        html_body: String,
        text_body: Option<String>,
    },
}

/// Email message envelope for direct SMTP send.
#[derive(Debug, Clone)]
pub struct EmailMessage {
    pub to: String,
    pub subject: Option<String>,
    pub content: EmailContent,
    pub cc: Option<Vec<String>>,
    pub bcc: Option<Vec<String>>,
}

#[async_trait]
pub trait EmailSender: Send + Sync {
    async fn send(&self, message: &EmailMessage) -> Result<(), anyhow::Error>;
}

pub mod smtp_sender {
    use super::{EmailContent, EmailMessage, EmailSender};
    use crate::configs::email_config::EmailConfig;
    use async_trait::async_trait;
    use lettre::Transport;
    use lettre::message::{Mailbox, Message, SinglePart, header};
    use lettre::transport::smtp::SmtpTransport;
    use lettre::transport::smtp::authentication::Credentials;

    /// SMTP-backed email sender using lettre (sync transport wrapped for async)
    pub struct SmtpEmailSender {
        transport: SmtpTransport,
        from: Mailbox,
    }

    impl SmtpEmailSender {
        pub fn try_new(cfg: &EmailConfig) -> anyhow::Result<Self> {
            let from = if let Some(name) = &cfg.from_name {
                Mailbox::new(Some(name.to_string()), cfg.from_email.parse()?)
            } else {
                Mailbox::new(None, cfg.from_email.parse()?)
            };

            let creds = Credentials::new(cfg.smtp_username.clone(), cfg.smtp_password.clone());
            // Prefer STARTTLS when enabled (e.g., Gmail on port 587). Use SMTPS/relay or dangerous only when disabled.
            let transport = if cfg.use_starttls {
                SmtpTransport::starttls_relay(&cfg.smtp_host)?
                    .port(cfg.smtp_port)
                    .credentials(creds)
                    .build()
            } else {
                // If STARTTLS explicitly disabled, try secure relay first; if that doesn't suit, fallback to dangerous.
                SmtpTransport::relay(&cfg.smtp_host)
                    .unwrap_or_else(|_| SmtpTransport::builder_dangerous(&cfg.smtp_host))
                    .port(cfg.smtp_port)
                    .credentials(creds)
                    .build()
            };

            Ok(Self { transport, from })
        }
    }

    #[async_trait]
    impl EmailSender for SmtpEmailSender {
        async fn send(&self, message: &EmailMessage) -> Result<(), anyhow::Error> {
            let mut builder = Message::builder().from(self.from.clone());
            builder = builder.to(message.to.parse()?);
            if let Some(subj) = &message.subject {
                builder = builder.subject(subj);
            }

            let (html_body, text_body) = match &message.content {
                EmailContent::Raw {
                    html_body,
                    text_body,
                } => (html_body.clone(), text_body.clone()),
            };

            let alternative = lettre::message::MultiPart::alternative()
                .singlepart(
                    SinglePart::builder()
                        .header(header::ContentType::TEXT_PLAIN)
                        .body(text_body.unwrap_or_default()),
                )
                .singlepart(
                    SinglePart::builder()
                        .header(header::ContentType::TEXT_HTML)
                        .body(html_body),
                );

            let email = builder.multipart(alternative)?;

            let transport = self.transport.clone();
            tokio::task::spawn_blocking(move || transport.send(&email))
                .await
                .map_err(|e| anyhow::anyhow!(e.to_string()))
                .and_then(|res| res.map(|_| ()).map_err(|e| anyhow::anyhow!(e.to_string())))
        }
    }
}
