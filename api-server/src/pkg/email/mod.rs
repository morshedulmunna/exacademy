use std::time::Duration;

use anyhow::{Context, Result};
use rdkafka::config::ClientConfig as RdKafkaClientConfig;
use rdkafka::error::KafkaError;
use rdkafka::producer::{FutureProducer, FutureRecord};
use rdkafka::types::RDKafkaErrorCode;
use serde::{Deserialize, Serialize};

use crate::configs::kafka_config::KafkaConfig;

#[async_trait::async_trait]
pub trait EmailSender: Send + Sync {
    /// Send an `EmailMessage` via the concrete transport.
    async fn send_email(&self, msg: &EmailMessage) -> anyhow::Result<()>;
}

/// Lightweight producer wrapper for sending email messages via Kafka.
pub struct EmailQueueProducer {
    producer: FutureProducer,
    topic: String,
}

impl EmailQueueProducer {
    /// Build a producer from `KafkaConfig`.
    pub fn from_config(config: &KafkaConfig) -> Result<Self> {
        let producer: FutureProducer = RdKafkaClientConfig::new()
            .set("bootstrap.servers", &config.brokers)
            .set("client.id", &config.client_id)
            .set("message.timeout.ms", "5000")
            .create()
            .context("failed to create Kafka FutureProducer")?;

        Ok(Self {
            producer,
            topic: config.email_topic.clone(),
        })
    }
}

#[async_trait::async_trait]
impl EmailSender for EmailQueueProducer {
    /// Send an `EmailMessage` to the configured topic.
    async fn send_email(&self, msg: &EmailMessage) -> Result<()> {
        let payload = serde_json::to_vec(msg).context("serialize EmailMessage")?;
        let record = FutureRecord::<(), Vec<u8>>::to(&self.topic).payload(&payload);
        match self.producer.send(record, Duration::from_secs(5)).await {
            Ok(_delivery) => Ok(()),
            Err((err, _owned_msg)) => match err {
                KafkaError::MessageProduction(RDKafkaErrorCode::QueueFull) => {
                    Err(anyhow::anyhow!("kafka queue full"))
                }
                other => Err(anyhow::anyhow!(other).context("kafka send failed")),
            },
        }
    }
}

/// Email content can be raw HTML/text or a reference to an external template.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum EmailContent {
    /// Directly provided content
    Raw {
        html_body: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        text_body: Option<String>,
    },
    /// External template reference with variables/context
    Template {
        /// Template identifier (name or ID) resolved by the consumer service
        template: String,
        /// Arbitrary variables to render the template with
        #[serde(default)]
        variables: serde_json::Value,
    },
}

/// Typed payload for email messages that the Kafka consumer will process.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailMessage {
    pub to: String,
    /// Optional subject if not provided by template
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subject: Option<String>,
    pub content: EmailContent,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cc: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bcc: Option<Vec<String>>,
}
