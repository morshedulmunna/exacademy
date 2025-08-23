use std::time::Duration;

use serde::Deserialize;

use crate::pkg::error::AppError;

/// Minimal Vimeo API client used for uploading videos via the streaming endpoint.
///
/// This client authenticates using a personal access token (Bearer token).
/// See Vimeo developer docs for required scopes (typically: `video_files`, `private`).
pub struct VimeoClient {
    http: reqwest::Client,
    token: String,
}

impl VimeoClient {
    /// Create a new Vimeo client with the provided API token.
    pub fn new(token: impl Into<String>) -> Self {
        let http = reqwest::Client::builder()
            .timeout(Duration::from_secs(120))
            .build()
            .expect("reqwest client");
        Self {
            http,
            token: token.into(),
        }
    }

    /// Upload raw bytes as a video to Vimeo using the simplified streaming flow.
    ///
    /// Returns the Vimeo video URI and link if successful.
    pub async fn upload_bytes(
        &self,
        name: &str,
        description: Option<&str>,
        privacy_view: Option<&str>,
        bytes: Vec<u8>,
        content_type: Option<&str>,
    ) -> Result<VimeoUploadResult, AppError> {
        // Step 1: Create a video with upload.type = streaming
        #[derive(Deserialize)]
        struct CreateResp {
            uri: String,
            link: Option<String>,
            upload: Option<CreateUpload>,
        }
        #[derive(Deserialize)]
        struct CreateUpload {
            upload_link: Option<String>,
        }

        let create_body = serde_json::json!({
            "upload": { "approach": "streaming" },
            "name": name,
            "description": description,
            "privacy": { "view": privacy_view.unwrap_or("unlisted") },
        });

        let create_res = self
            .http
            .post("https://api.vimeo.com/me/videos")
            .bearer_auth(&self.token)
            .json(&create_body)
            .send()
            .await
            .map_err(|e| AppError::ServiceUnavailable(format!("Vimeo create error: {}", e)))?;

        if !create_res.status().is_success() {
            let status = create_res.status();
            let text = create_res
                .text()
                .await
                .unwrap_or_else(|_| "<no body>".to_string());
            return Err(AppError::ServiceUnavailable(format!(
                "Vimeo create failed: {} {}",
                status, text
            )));
        }

        let created: CreateResp = create_res
            .json()
            .await
            .map_err(|e| AppError::Internal(format!("Vimeo create decode error: {}", e)))?;

        let upload_link = created
            .upload
            .and_then(|u| u.upload_link)
            .ok_or_else(|| AppError::ServiceUnavailable("Vimeo missing upload link".into()))?;

        // Step 2: PUT the file bytes to the upload_link
        let ct = content_type.unwrap_or("video/mp4");
        let put_res = self
            .http
            .put(upload_link)
            .bearer_auth(&self.token)
            .header(reqwest::header::CONTENT_TYPE, ct)
            .body(bytes)
            .send()
            .await
            .map_err(|e| AppError::ServiceUnavailable(format!("Vimeo upload error: {}", e)))?;

        if !put_res.status().is_success() {
            let status = put_res.status();
            let text = put_res
                .text()
                .await
                .unwrap_or_else(|_| "<no body>".to_string());
            return Err(AppError::ServiceUnavailable(format!(
                "Vimeo upload failed: {} {}",
                status, text
            )));
        }

        Ok(VimeoUploadResult {
            uri: created.uri,
            link: created.link,
        })
    }
}

/// Basic information about an uploaded Vimeo video
#[derive(Debug, Clone, Deserialize)]
pub struct VimeoUploadResult {
    pub uri: String,
    pub link: Option<String>,
}
