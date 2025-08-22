use std::env;

/// Kafka configuration for producing email messages
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct KafkaConfig {
    pub brokers: String,
    pub email_topic: String,
    pub client_id: String,
}

impl KafkaConfig {
    pub fn load_from_env() -> Result<Self, Box<dyn std::error::Error>> {
        let _ = dotenv::dotenv().ok();

        let brokers = env::var("KAFKA_BROKERS").unwrap_or_else(|_| "localhost:9092".to_string());
        let email_topic = env::var("KAFKA_EMAIL_TOPIC").unwrap_or_else(|_| "emails".to_string());
        let client_id = env::var("KAFKA_CLIENT_ID").unwrap_or_else(|_| "execute_academy_api".to_string());

        Ok(Self {
            brokers,
            email_topic,
            client_id,
        })
    }
}


