use axum_extra::extract::Multipart;

use crate::pkg::error::{AppError, AppResult};

/// Universal multipart form-data parser with helpers for common field types.
///
/// This utility avoids repetitive manual parsing in handlers. It reads the
/// multipart stream once and exposes typed getters.
pub struct MultipartForm {
    fields: std::collections::HashMap<String, String>,
    files: std::collections::HashMap<String, MultipartFile>,
}

/// Represents a single uploaded file captured from a multipart field.
pub struct MultipartFile {
    pub file_name: Option<String>,
    pub content_type: Option<String>,
    pub data: bytes::Bytes,
}

impl MultipartForm {
    /// Parse multipart into memory. For files, we collect all bytes.
    /// Use carefully for very large uploads; handlers can instead stream
    /// via `Storage::save_multipart_field` when needed.
    /// Parse with a maximum allowed file size in bytes. Files exceeding the
    /// limit cause a BadRequest error.
    pub async fn parse_with_limit(
        mut multipart: Multipart,
        max_file_bytes: usize,
    ) -> AppResult<Self> {
        let mut fields = std::collections::HashMap::new();
        let mut files = std::collections::HashMap::new();

        while let Some(field) = multipart
            .next_field()
            .await
            .map_err(|e| AppError::BadRequest(e.to_string()))?
        {
            let name = match field.name().map(|s| s.to_string()) {
                Some(n) => n,
                None => continue,
            };

            let file_name = field.file_name().map(|s| s.to_string());
            let content_type = field.content_type().map(|s| s.to_string());

            // Heuristic: if file_name exists or content_type suggests a file, treat as file
            if file_name.is_some()
                || content_type
                    .as_deref()
                    .map(|ct| {
                        ct.starts_with("image/")
                            || ct.starts_with("video/")
                            || ct == "application/octet-stream"
                    })
                    .unwrap_or(false)
            {
                let mut size: usize = 0;
                let mut buf = bytes::BytesMut::new();
                let mut f = field;
                while let Some(chunk) = f
                    .chunk()
                    .await
                    .map_err(|e| AppError::BadRequest(e.to_string()))?
                {
                    size = size.saturating_add(chunk.len());
                    if size > max_file_bytes {
                        return Err(AppError::BadRequest("File size exceeds limit".into()));
                    }
                    buf.extend_from_slice(&chunk);
                }
                files.insert(
                    name,
                    MultipartFile {
                        file_name,
                        content_type,
                        data: buf.freeze(),
                    },
                );
            } else {
                let text = field
                    .text()
                    .await
                    .map_err(|e| AppError::BadRequest(e.to_string()))?;
                fields.insert(name, text);
            }
        }

        Ok(Self { fields, files })
    }

    /// Backward-compatible parser with a generous default limit (10 MiB).
    pub async fn parse(multipart: Multipart) -> AppResult<Self> {
        Self::parse_with_limit(multipart, 10 * 1024 * 1024).await
    }

    pub fn text(&self, key: &str) -> Option<&str> {
        self.fields.get(key).map(|s| s.as_str())
    }

    pub fn required_text(&self, key: &str) -> AppResult<&str> {
        self.text(key)
            .ok_or_else(|| AppError::BadRequest(format!("{} is required", key)))
    }

    pub fn bool(&self, key: &str) -> Option<bool> {
        self.text(key).map(|v| matches!(v, "true" | "1" | "on"))
    }

    pub fn f64(&self, key: &str) -> Option<f64> {
        self.text(key).and_then(|v| v.parse::<f64>().ok())
    }

    pub fn json_vec_string(&self, key: &str) -> Option<Vec<String>> {
        self.text(key).and_then(|v| {
            serde_json::from_str::<Vec<String>>(v).ok().or_else(|| {
                Some(
                    v.split(',')
                        .map(|s| s.trim().to_string())
                        .filter(|s| !s.is_empty())
                        .collect(),
                )
            })
        })
    }

    pub fn file(&self, key: &str) -> Option<&MultipartFile> {
        self.files.get(key)
    }
}
