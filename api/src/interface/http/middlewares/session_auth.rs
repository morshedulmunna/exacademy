use std::future::{Future, Ready, ready};
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll};

use actix_web::body::{BoxBody, EitherBody, MessageBody};
use actix_web::dev::{Service, ServiceRequest, ServiceResponse, Transform};
use actix_web::{Error as ActixError, HttpMessage};

use crate::application::services::AuthService;
use crate::infrastructure::repositories::{MongoSessionRepository, MongoUserRepository};
use crate::pkg::mongodb::get_mongodb_database;

/// Extract and validate session from "Authorization: Bearer <sessionToken>" or cookie `session`.
pub struct SessionAuth;

impl SessionAuth {
    pub fn new() -> Self {
        Self
    }
}

impl<S, B> Transform<S, ServiceRequest> for SessionAuth
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = ActixError> + 'static,
    B: MessageBody + 'static,
{
    type Response = ServiceResponse<EitherBody<BoxBody, B>>;
    type Error = ActixError;
    type Transform = SessionAuthMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(SessionAuthMiddleware {
            service: Rc::new(service),
        }))
    }
}

pub struct SessionAuthMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for SessionAuthMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = ActixError> + 'static,
    B: MessageBody + 'static,
{
    type Response = ServiceResponse<EitherBody<BoxBody, B>>;
    type Error = ActixError;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + 'static>>;

    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let token = extract_token(&req);
        let service = Rc::clone(&self.service);

        Box::pin(async move {
            if let Some(token) = token {
                if let Ok(db) = get_mongodb_database().await {
                    let user_repo = MongoUserRepository::new(&db);
                    let session_repo = MongoSessionRepository::new(&db);
                    let auth = AuthService::new(user_repo, session_repo, 24);
                    if let Ok(Some(user)) = auth.validate_session(&token).await {
                        req.extensions_mut().insert(user);
                    }
                }
            }

            let res = service.call(req).await?;
            Ok(res.map_into_right_body())
        })
    }
}

fn extract_token(req: &ServiceRequest) -> Option<String> {
    // Authorization: Bearer <token>
    if let Some(header_value) = req.headers().get("Authorization") {
        if let Ok(value) = header_value.to_str() {
            if let Some(rest) = value.strip_prefix("Bearer ") {
                return Some(rest.trim().to_string());
            }
        }
    }
    // Cookie: session=<token>
    if let Some(cookie) = req.cookie("session") {
        return Some(cookie.value().to_string());
    }
    None
}
