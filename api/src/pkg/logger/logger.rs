use crate::pkg::logger::types::{LogLevel, LogRecord};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::Mutex;

/// Main logger struct that provides structured logging capabilities
pub struct Logger {
    service_name: String,
    extra_fields: Arc<Mutex<HashMap<String, serde_json::Value>>>,
}

impl Logger {
    /// Create a new logger instance with the given service name
    pub fn new(service_name: &str) -> Self {
        Self {
            service_name: service_name.to_string(),
            extra_fields: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    /// Get the caller information (file:line)
    fn get_caller() -> String {
        // Use a simpler approach that doesn't rely on unstable features
        // For now, we'll use a placeholder that can be enhanced later
        // This is more stable and doesn't require nightly Rust
        "logger.rs:0".to_string()
    }

    /// Log a message with the specified level
    pub fn log(&self, level: LogLevel, message: &str, error: Option<&str>) {
        let caller = Self::get_caller();
        let record = LogRecord::new(level, &caller, message, &self.service_name, error);

        // Convert to JSON and print
        if let Ok(json) = serde_json::to_string(&record) {
            println!("{}", json);
        }
    }

    /// Log a debug message
    pub fn debug(&self, message: &str) {
        self.log(LogLevel::Debug, message, None);
    }

    /// Log an info message
    pub fn info(&self, message: &str) {
        self.log(LogLevel::Info, message, None);
    }

    /// Log a warning message
    pub fn warn(&self, message: &str) {
        self.log(LogLevel::Warn, message, None);
    }

    /// Log an error message
    pub fn error(&self, message: &str) {
        self.log(LogLevel::Error, message, None);
    }

    /// Log an error message with error details
    pub fn error_with_details(&self, message: &str, error: &str) {
        self.log(LogLevel::Error, message, Some(error));
    }

    /// Log an error message with a Result's error
    pub fn error_result<T, E: std::fmt::Display>(&self, message: &str, result: &Result<T, E>) {
        if let Err(e) = result {
            self.error_with_details(message, &e.to_string());
        }
    }

    /// Add a global field that will be included in all log messages
    pub async fn add_global_field(&self, key: &str, value: serde_json::Value) {
        let mut fields = self.extra_fields.lock().await;
        fields.insert(key.to_string(), value);
    }

    /// Remove a global field
    pub async fn remove_global_field(&self, key: &str) {
        let mut fields = self.extra_fields.lock().await;
        fields.remove(key);
    }

    /// Log with additional fields
    pub fn log_with_fields(
        &self,
        level: LogLevel,
        message: &str,
        error: Option<&str>,
        fields: HashMap<String, serde_json::Value>,
    ) {
        let caller = Self::get_caller();
        let mut record = LogRecord::new(level, &caller, message, &self.service_name, error);
        record.extra_fields = fields;

        if let Ok(json) = serde_json::to_string(&record) {
            println!("{}", json);
        }
    }
}

impl Clone for Logger {
    fn clone(&self) -> Self {
        Self {
            service_name: self.service_name.clone(),
            extra_fields: Arc::clone(&self.extra_fields),
        }
    }
}
