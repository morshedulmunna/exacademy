use actix_web::cookie::{Cookie, SameSite, time::Duration as CookieDuration};
use actix_web::{HttpResponse, web};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::application::services::{AuthService, UserRepository};
use crate::configs::configs::{AppConfig, Mode};
use crate::infrastructure::repositories::{MongoSessionRepository, MongoUserRepository};
use crate::interface::http::middlewares::auth_extractor::CurrentUser;
use crate::pkg::error::{AppError, AppResult};
use crate::pkg::mongodb::get_mongodb_database;
use crate::pkg::response::ApiResponse;
use crate::pkg::security::{hash_password, verify_password};

#[derive(Debug, Deserialize, ToSchema)]
pub struct RegisterRequest {
    pub email: String,
    pub name: String,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, ToSchema)]
pub struct MeResponse {
    pub id: String,
    pub email: String,
    pub name: String,
    pub username: String,
    pub role: String,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[utoipa::path(
    post,
    path = "/auth/register",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "Registered", body = serde_json::Value),
        (status = 409, description = "Conflict", body = crate::pkg::response::ApiErrorResponse),
    ),
    tag = "auth"
)]
pub async fn register(payload: web::Json<RegisterRequest>) -> AppResult<HttpResponse> {
    let db = get_mongodb_database()
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

    // ensure unique by email and username
    let users = MongoUserRepository::new(&db);
    if users
        .find_by_email(&payload.email)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?
        .is_some()
    {
        return Err(AppError::Conflict("Email already in use".into()));
    }

    // insert new user document
    let password_hash =
        hash_password(&payload.password).map_err(|e| AppError::Internal(e.to_string()))?;
    let coll = db.collection::<mongodb::bson::Document>("users");
    let now = chrono::Utc::now();
    let doc = mongodb::bson::doc! {
        "email": &payload.email,
        "name": &payload.name,
        "username": &payload.username,
        "password": password_hash,
        "role": "USER",
        "createdAt": mongodb::bson::DateTime::from_millis(now.timestamp_millis()),
        "updatedAt": mongodb::bson::DateTime::from_millis(now.timestamp_millis()),
    };
    coll.insert_one(doc)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

    let body = ApiResponse::<serde_json::Value>::with_message("registered", 201);
    Ok(HttpResponse::Created().json(body))
}

#[utoipa::path(
    post,
    path = "/auth/login",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Logged in", body = serde_json::Value),
        (status = 401, description = "Unauthorized", body = crate::pkg::response::ApiErrorResponse),
    ),
    tag = "auth"
)]
pub async fn login(
    config: web::Data<AppConfig>,
    payload: web::Json<LoginRequest>,
) -> AppResult<HttpResponse> {
    let db = get_mongodb_database()
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;
    let users = MongoUserRepository::new(&db);
    let sessions = MongoSessionRepository::new(&db);
    let auth = AuthService::new(users, sessions, 24);

    let user_repo = MongoUserRepository::new(&db);
    let user = user_repo
        .find_by_email(&payload.email)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?
        .ok_or_else(|| AppError::Unauthorized("Invalid credentials".into()))?;

    let ok = verify_password(&payload.password, &user.password_hash)
        .map_err(|e| AppError::Internal(e.to_string()))?;
    if !ok {
        return Err(AppError::Unauthorized("Invalid credentials".into()));
    }

    let session = auth
        .create_session(&user.id)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

    // Build HTTP-only cookie for the session token
    let max_age_secs = (session.expires - chrono::Utc::now()).num_seconds().max(0);
    let is_secure_cookie = matches!(config.mode, Mode::Production);
    let session_cookie = Cookie::build("session", session.session_token.clone())
        .path("/")
        .http_only(true)
        .secure(is_secure_cookie)
        .same_site(SameSite::Lax)
        .max_age(CookieDuration::seconds(max_age_secs))
        .finish();

    let body = ApiResponse::with_data(
        "logged in",
        serde_json::json!({
            "sessionToken": session.session_token,
            "expires": session.expires,
        }),
        200,
    );
    Ok(HttpResponse::Ok().cookie(session_cookie).json(body))
}

#[utoipa::path(
    post,
    path = "/auth/logout",
    responses(
        (status = 200, description = "Logged out", body = serde_json::Value),
        (status = 401, description = "Unauthorized", body = crate::pkg::response::ApiErrorResponse),
    ),
    tag = "auth"
)]
pub async fn logout(
    config: web::Data<AppConfig>,
    req: actix_web::HttpRequest,
) -> AppResult<HttpResponse> {
    let db = get_mongodb_database()
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;
    let sessions = MongoSessionRepository::new(&db);
    let users = MongoUserRepository::new(&db);
    let auth = AuthService::new(users, sessions, 24);

    // Extract token
    let token = req
        .headers()
        .get("Authorization")
        .and_then(|h| h.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .map(|s| s.to_string())
        .or_else(|| req.cookie("session").map(|c| c.value().to_string()))
        .ok_or_else(|| AppError::Unauthorized("Missing session token".into()))?;

    auth.destroy_session(&token)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

    // Remove session cookie in the client
    let is_secure_cookie = matches!(config.mode, Mode::Production);
    let removal_cookie = Cookie::build("session", "")
        .path("/")
        .http_only(true)
        .secure(is_secure_cookie)
        .same_site(SameSite::Lax)
        .max_age(CookieDuration::seconds(0))
        .finish();

    let body = ApiResponse::<serde_json::Value>::with_message("logged out", 200);
    Ok(HttpResponse::Ok().cookie(removal_cookie).json(body))
}

#[utoipa::path(
    get,
    path = "/auth/me",
    responses(
        (status = 200, description = "Current user", body = MeResponse),
        (status = 401, description = "Unauthorized", body = crate::pkg::response::ApiErrorResponse),
    ),
    tag = "auth"
)]
pub async fn me(CurrentUser(user): CurrentUser) -> AppResult<HttpResponse> {
    let res = MeResponse {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: format!("{:?}", user.role),
    };
    let body = ApiResponse::with_data("me", res, 200);
    Ok(HttpResponse::Ok().json(body))
}
