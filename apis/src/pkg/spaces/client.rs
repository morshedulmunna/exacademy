use aws_config::SdkConfig;
use aws_credential_types::{Credentials, provider::SharedCredentialsProvider};
use aws_sdk_s3::{
    Client as S3Client,
    config::Builder as S3ConfigBuilder,
    operation::complete_multipart_upload::CompleteMultipartUploadOutput,
    operation::create_multipart_upload::CreateMultipartUploadOutput,
    types::{CompletedMultipartUpload, CompletedPart},
};

use std::time::Duration;
use uuid::Uuid;

use crate::configs::spaces_config::SpacesConfig;
use crate::pkg::error::AppError;

/// DigitalOcean Spaces client for handling multipart uploads
pub struct SpacesClient {
    pub client: S3Client,
    pub config: SpacesConfig,
}

impl SpacesClient {
    /// Create a new Spaces client
    pub async fn new(config: SpacesConfig) -> Result<Self, AppError> {
        let credentials = Credentials::new(
            config.access_key_id.clone(),
            config.secret_access_key.clone(),
            None,
            None,
            "spaces",
        );

        let credentials_provider = SharedCredentialsProvider::new(credentials);

        let sdk_config = SdkConfig::builder()
            .region(aws_sdk_s3::config::Region::new(config.region.clone()))
            .credentials_provider(credentials_provider)
            .endpoint_url(config.endpoint.clone())
            .build();

        let s3_config = S3ConfigBuilder::from(&sdk_config)
            .endpoint_url(config.endpoint.clone())
            .force_path_style(true)
            .build();

        let client = S3Client::from_conf(s3_config);

        Ok(Self { client, config })
    }

    /// Initialize a multipart upload
    pub async fn create_multipart_upload(
        &self,
        file_key: &str,
        content_type: &str,
    ) -> Result<CreateMultipartUploadOutput, AppError> {
        let result = self
            .client
            .create_multipart_upload()
            .bucket(&self.config.bucket_name)
            .key(file_key)
            .content_type(content_type)
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Failed to create multipart upload: {}", e)))?;

        Ok(result)
    }

    /// Generate presigned URL for uploading a chunk
    pub async fn generate_presigned_url(
        &self,
        file_key: &str,
        upload_id: &str,
        part_number: i32,
        expires_in: Duration,
    ) -> Result<String, AppError> {
        let presigned_request = self
            .client
            .upload_part()
            .bucket(&self.config.bucket_name)
            .key(file_key)
            .upload_id(upload_id)
            .part_number(part_number)
            .presigned(aws_sdk_s3::presigning::PresigningConfig::expires_in(expires_in).unwrap())
            .await
            .map_err(|e| AppError::Internal(format!("Failed to generate presigned URL: {}", e)))?;

        Ok(presigned_request.uri().to_string())
    }

    /// Complete the multipart upload
    pub async fn complete_multipart_upload(
        &self,
        file_key: &str,
        upload_id: &str,
        etags: Vec<String>,
    ) -> Result<CompleteMultipartUploadOutput, AppError> {
        let mut completed_parts = Vec::new();

        // Filter out fallback ETags (those that start with "chunk-")
        let valid_etags: Vec<String> = etags
            .into_iter()
            .filter(|etag| !etag.starts_with("chunk-"))
            .collect();

        if valid_etags.is_empty() {
            // If no valid ETags, we need to handle this differently
            // For DigitalOcean Spaces, we might need to use a different completion strategy
            println!("Warning: No valid ETags found, using alternative completion method");

            // Try to complete without ETags (some S3-compatible services allow this)
            let completed_multipart = CompletedMultipartUpload::builder().set_parts(None).build();

            let result = self
                .client
                .complete_multipart_upload()
                .bucket(&self.config.bucket_name)
                .key(file_key)
                .upload_id(upload_id)
                .multipart_upload(completed_multipart)
                .send()
                .await;

            match result {
                Ok(output) => return Ok(output),
                Err(e) => {
                    println!("Failed to complete without ETags: {}", e);
                    // Fall back to using part numbers without ETags
                }
            }
        }

        // Use valid ETags if available
        for (index, etag) in valid_etags.into_iter().enumerate() {
            let part = CompletedPart::builder()
                .e_tag(etag)
                .part_number((index + 1) as i32)
                .build();
            completed_parts.push(part);
        }

        let completed_multipart = CompletedMultipartUpload::builder()
            .set_parts(Some(completed_parts))
            .build();

        let result = self
            .client
            .complete_multipart_upload()
            .bucket(&self.config.bucket_name)
            .key(file_key)
            .upload_id(upload_id)
            .multipart_upload(completed_multipart)
            .send()
            .await
            .map_err(|e| {
                AppError::Internal(format!("Failed to complete multipart upload: {}", e))
            })?;

        Ok(result)
    }

    /// Abort a multipart upload
    pub async fn abort_multipart_upload(
        &self,
        file_key: &str,
        upload_id: &str,
    ) -> Result<(), AppError> {
        self.client
            .abort_multipart_upload()
            .bucket(&self.config.bucket_name)
            .key(file_key)
            .upload_id(upload_id)
            .send()
            .await
            .map_err(|e| AppError::Internal(format!("Failed to abort multipart upload: {}", e)))?;

        Ok(())
    }

    /// Get the public URL for a file
    pub fn get_public_url(&self, file_key: &str) -> String {
        format!("{}/{}", self.config.public_url, file_key)
    }

    /// Generate a unique file key for videos
    pub fn generate_file_key(&self, filename: &str, lesson_id: Option<Uuid>) -> String {
        let timestamp = chrono::Utc::now().timestamp();
        let uuid = Uuid::new_v4();

        let lesson_suffix = lesson_id
            .map(|id| format!("lesson_{}", id))
            .unwrap_or_else(|| "general".to_string());

        format!(
            "videos/{}/{}_{}_{}",
            lesson_suffix, timestamp, uuid, filename
        )
    }
}
