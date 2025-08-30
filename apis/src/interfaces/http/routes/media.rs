use axum::{
    Router,
    routing::post,
};

use crate::interfaces::http::handlers::media as h;

pub fn router() -> Router {
    Router::new()
        .route("/api/media/upload", post(h::upload_media))
}
