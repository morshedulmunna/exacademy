use axum::{
    Router,
    routing::post,
};

use crate::interfaces::http::handlers::video as h;

pub fn router() -> Router {
    Router::new()
        .route("/api/video/upload/init", post(h::init_video_upload))
        .route("/api/video/upload/complete", post(h::complete_video_upload))
        .route("/api/video/upload/chunk", post(h::upload_video_chunk))
}
