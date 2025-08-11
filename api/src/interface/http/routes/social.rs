use actix_web::{HttpResponse, web};
use serde::Deserialize;
use utoipa::ToSchema;

use crate::application::services::AuthService;
use crate::application::social::SocialAuthService;
use crate::configs::load::load_config;
use crate::infrastructure::repositories::{MongoAccountsRepository, MongoSessionRepository, MongoUserRepository};
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::mongodb::get_mongodb_database;
use crate::pkg::response::ApiResponse;

#[derive(Deserialize, ToSchema)]
pub struct PathProvider {
    provider: String,
}

#[utoipa::path(
    get,
    path = "/oauth/{provider}/start",
    params(("provider" = String, Path, description = "OAuth provider name")),
    responses((status = 302, description = "Redirect to provider")),
    tag = "oauth"
)]
pub async fn start(path: web::Path<PathProvider>, query: web::Query<std::collections::HashMap<String, String>>) -> AppResult<HttpResponse> {
    let provider = path.provider.clone();
    let state = query.get("state").cloned().unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    let db = get_mongodb_database().await.map_err(|e| AppError::Internal(e.to_string()))?;
    let conf = load_config().map_err(|e| AppError::Internal(e.to_string()))?;
    let users = MongoUserRepository::new(&db);
    let sessions = MongoSessionRepository::new(&db);
    let accounts = MongoAccountsRepository::new(&db);
    let auth = AuthService::new(users, sessions, 24);
    let social = SocialAuthService::new(auth, accounts, conf.oauth, db);
    let url = social.authorize_url(&provider, state).map_err(|e| AppError::BadRequest(e.to_string()))?;
    Ok(HttpResponse::Found().insert_header((actix_web::http::header::LOCATION, url)).finish())
}

#[utoipa::path(
    get,
    path = "/oauth/{provider}/callback",
    params(("provider" = String, Path, description = "OAuth provider name")),
    responses((status = 200, description = "OAuth login success", body = serde_json::Value)),
    tag = "oauth"
)]
pub async fn callback(path: web::Path<PathProvider>, query: web::Query<std::collections::HashMap<String, String>>) -> AppResult<HttpResponse> {
    let provider = path.provider.clone();
    let code = query.get("code").cloned().ok_or_else(|| AppError::BadRequest("missing code".into()))?;
    let db = get_mongodb_database().await.map_err(|e| AppError::Internal(e.to_string()))?;
    let conf = load_config().map_err(|e| AppError::Internal(e.to_string()))?;
    let users = MongoUserRepository::new(&db);
    let sessions = MongoSessionRepository::new(&db);
    let accounts = MongoAccountsRepository::new(&db);
    let auth = AuthService::new(users, sessions, 24);
    let social = SocialAuthService::new(auth, accounts, conf.oauth, db);
    let (_user, session_token) = social.handle_callback(&provider, &code).await.map_err(|e| AppError::Unauthorized(e.to_string()))?;
    let body = ApiResponse::with_data("oauth login success", serde_json::json!({"sessionToken": session_token}), 200);
    Ok(HttpResponse::Ok().json(body))
}


