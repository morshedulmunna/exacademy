use std::path::{Path, PathBuf};
use tokio::fs;
use tokio::io::AsyncWriteExt;

use axum_extra::extract::multipart::Field;

use crate::pkg::error::AppError;

/// Storage abstraction for saving uploads. Currently only LocalFsStorage is implemented.
#[async_trait::async_trait]
pub trait Storage: Send + Sync {
    /// Save an in-memory buffer and return a relative path like "/uploads/<file>".
    async fn save_bytes(
        &self,
        bytes: &[u8],
        original_name: Option<&str>,
    ) -> Result<String, AppError>;

    /// Save a multipart field stream to disk with a size cap; returns a relative path.
    async fn save_multipart_field(
        &self,
        field: Field,
        original_name: Option<&str>,
        max_bytes: usize,
    ) -> Result<String, AppError>;
}

/// Local filesystem storage under ./uploads.
pub struct LocalFsStorage {
    root: PathBuf,
}

impl LocalFsStorage {
    pub fn new<P: Into<PathBuf>>(root: P) -> Self {
        Self { root: root.into() }
    }

    fn ensure_dir(&self) -> Result<(), AppError> {
        if !self.root.exists() {
            std::fs::create_dir_all(&self.root).map_err(|e| AppError::Internal(e.to_string()))?;
        }
        Ok(())
    }

    /// Compute a web-visible prefix under "/uploads" that mirrors the
    /// on-disk `root` path. For example, if `root` is `./uploads/courses`,
    /// this returns `uploads/courses`. If no `uploads` segment is present,
    /// fall back to just `uploads`.
    fn web_prefix_under_uploads(&self) -> String {
        use std::path::Component;

        let mut started = false;
        let mut parts: Vec<String> = Vec::new();
        for comp in self.root.components() {
            let s = match comp {
                Component::Prefix(p) => p.as_os_str().to_string_lossy().into_owned(),
                Component::RootDir => continue,
                Component::CurDir => continue,
                Component::ParentDir => continue,
                Component::Normal(os) => os.to_string_lossy().into_owned(),
            };
            if s == "uploads" {
                started = true;
            }
            if started {
                parts.push(s);
            }
        }

        if parts.is_empty() {
            "uploads".to_string()
        } else {
            parts.join("/")
        }
    }

    fn next_filename(&self, original_name: Option<&str>) -> String {
        // Preserve extension if present; otherwise use UUID only
        if let Some(name) = original_name {
            if let Some(ext) = Path::new(name).extension().and_then(|e| e.to_str()) {
                return format!("{}.{}", uuid::Uuid::new_v4(), ext);
            }
        }
        uuid::Uuid::new_v4().to_string()
    }
}

#[async_trait::async_trait]
impl Storage for LocalFsStorage {
    async fn save_bytes(
        &self,
        bytes: &[u8],
        original_name: Option<&str>,
    ) -> Result<String, AppError> {
        self.ensure_dir()?;
        let filename = self.next_filename(original_name);
        let path = self.root.join(&filename);
        fs::write(&path, bytes)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;
        let web_prefix = self.web_prefix_under_uploads();
        Ok(format!("/{}/{}", web_prefix, filename))
    }

    async fn save_multipart_field(
        &self,
        mut field: Field,
        original_name: Option<&str>,
        max_bytes: usize,
    ) -> Result<String, AppError> {
        self.ensure_dir()?;
        let filename = self.next_filename(original_name);
        let path = self.root.join(&filename);
        let mut file = fs::File::create(&path)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;

        let mut written: usize = 0;
        while let Some(chunk) = field
            .chunk()
            .await
            .map_err(|e| AppError::BadRequest(e.to_string()))?
        {
            written = written.saturating_add(chunk.len());
            if written > max_bytes {
                let _ = fs::remove_file(&path).await; // best-effort cleanup
                return Err(AppError::BadRequest("File size exceeds limit".into()));
            }
            file.write_all(&chunk)
                .await
                .map_err(|e| AppError::Internal(e.to_string()))?;
        }

        let web_prefix = self.web_prefix_under_uploads();
        Ok(format!("/{}/{}", web_prefix, filename))
    }
}

/// Backwards-compatible helper: save bytes into ./uploads using LocalFsStorage.
pub async fn save_bytes(bytes: &[u8], original_name: Option<&str>) -> Result<String, AppError> {
    let storage = LocalFsStorage::new("./uploads");
    storage.save_bytes(bytes, original_name).await
}
