use crate::pkg::error::AppResult;
use crate::repositories::courses::CoursesRepository;
use tokio::fs;

/// Delete a course by id.
pub async fn delete_course_by_id(repo: &dyn CoursesRepository, id: uuid::Uuid) -> AppResult<()> {
    // Fetch existing course to capture thumbnail path (if any) before deletion
    let thumbnail_url = repo.find_by_id(id).await?.and_then(|c| c.thumbnail);

    // Delete the course record
    repo.delete_by_id(id).await?;

    // Best-effort deletion of local thumbnail file if it resides under our uploads path
    if let Some(url) = thumbnail_url {
        // Only attempt removal for locally stored thumbnails
        if let Some(idx) = url.find("/uploads/courses/") {
            let path_part = &url[idx..];
            if let Some(filename) = path_part.rsplit('/').next() {
                let disk_path = format!("./uploads/courses/{}", filename);
                let _ = fs::remove_file(disk_path).await;
            }
        }
    }

    Ok(())
}
