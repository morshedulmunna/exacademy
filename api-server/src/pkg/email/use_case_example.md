# Email queue and templates — use case example

This package provides a Kafka-backed producer to enqueue emails. The consumer service is expected to resolve templates and send the actual email.

## Template file

See `templates/welcome_email.html` as a simple example. It expects variables:

- `firstName`: string
- `ctaUrl`: string (absolute URL)

## Kafka payload shape

```json
{
  "to": "user@example.com",
  "subject": null,
  "content": {
    "type": "template",
    "template": "welcome_email",
    "variables": {
      "firstName": "Jane",
      "ctaUrl": "https://example.com/verify?token=abc"
    }
  },
  "cc": null,
  "bcc": null
}
```

- `subject` can be omitted (`null`) to let the template/consumer decide.
- `variables` is an arbitrary JSON object merged into the template context.

## Producing an email from Rust

```rust
use execute_academy::configs::app_context::AppContext;
use execute_academy::pkg::email::{EmailMessage, EmailContent};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let ctx = AppContext::get().await?;

    let msg = EmailMessage {
        to: "user@example.com".into(),
        subject: None, // let the consumer define it from the template
        content: EmailContent::Template {
            template: "welcome_email".into(),
            variables: serde_json::json!({
                "firstName": "Jane",
                "ctaUrl": "https://example.com/verify?token=abc",
            }),
        },
        cc: None,
        bcc: None,
    };

    ctx.email_producer.send_email(&msg).await?;
    Ok(())
}
```

## Raw content alternative

```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "content": {
    "type": "raw",
    "html_body": "<h1>Hello</h1>",
    "text_body": "Hello"
  }
}
```
