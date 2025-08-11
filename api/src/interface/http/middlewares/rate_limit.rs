use std::future::{Future, Ready, ready};
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll};
use std::time::Duration;

use actix_web::body::{BoxBody, EitherBody, MessageBody};
use actix_web::dev::{Service, ServiceRequest, ServiceResponse, Transform};
use actix_web::{Error, HttpResponse, http::header};

use crate::pkg::logger::warn;
use crate::pkg::rate_limit::{InMemorySlidingWindowRateLimiter, RateLimitConfig};
use crate::pkg::response::ApiErrorResponse;

/// Rate limit middleware configuration
#[derive(Clone)]
pub struct RateLimitConfigMiddleware {
    pub capacity: u32,
    pub window: Duration,
}

impl Default for RateLimitConfigMiddleware {
    fn default() -> Self {
        Self {
            capacity: 25,
            window: Duration::from_secs(60),
        }
    }
}

/// Actix middleware that applies a sliding window rate limit per client IP and route path
pub struct RateLimit {
    limiter: Rc<InMemorySlidingWindowRateLimiter>,
}

impl RateLimit {
    pub fn new(config: RateLimitConfigMiddleware) -> Self {
        let limiter = InMemorySlidingWindowRateLimiter::new(RateLimitConfig::new(
            config.capacity,
            config.window,
        ));
        Self {
            limiter: Rc::new(limiter),
        }
    }
}

impl<S, B> Transform<S, ServiceRequest> for RateLimit
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: MessageBody + 'static,
{
    type Response = ServiceResponse<EitherBody<BoxBody, B>>;
    type Error = Error;
    type Transform = RateLimitMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(RateLimitMiddleware {
            service: Rc::new(service),
            limiter: Rc::clone(&self.limiter),
        }))
    }
}

pub struct RateLimitMiddleware<S> {
    service: Rc<S>,
    limiter: Rc<InMemorySlidingWindowRateLimiter>,
}

impl<S, B> Service<ServiceRequest> for RateLimitMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: MessageBody + 'static,
{
    type Response = ServiceResponse<EitherBody<BoxBody, B>>;
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + 'static>>;

    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let peer_ip = req
            .connection_info()
            .realip_remote_addr()
            .unwrap_or("unknown")
            .to_string();
        let path = req.path().to_string();
        let key = InMemorySlidingWindowRateLimiter::compose_key(&["ip", &peer_ip, "path", &path]);
        let decision = self.limiter.check_and_consume(&key);

        if !decision.allowed {
            warn(format!(
                "Rate limited ip={} path={} retry_after_ms={}",
                peer_ip,
                path,
                decision
                    .retry_after
                    .map(|d| d.as_millis() as u64)
                    .unwrap_or(0)
            ));

            // Build standardized JSON error body
            let body = ApiErrorResponse::new(
                "TOO_MANY_REQUESTS",
                "Too many requests. Please retry later.",
            )
            .with_details(serde_json::json!({
                "ip": peer_ip,
                "path": path,
                "limit": decision.limit,
                "remaining": decision.remaining,
                "retry_after_ms": decision.retry_after.map(|d| d.as_millis()).unwrap_or(0),
                "reset_after_ms": decision.reset_after.as_millis(),
            }));

            // Build 429 with standard headers and JSON body
            let mut builder = HttpResponse::TooManyRequests();
            builder.insert_header((
                header::RETRY_AFTER,
                decision
                    .retry_after
                    .map(|d| (d.as_secs() as i64).to_string())
                    .unwrap_or_else(|| "1".to_string()),
            ));
            builder.insert_header((
                header::HeaderName::from_static("x-rate-limit-limit"),
                decision.limit.to_string(),
            ));
            builder.insert_header((
                header::HeaderName::from_static("x-rate-limit-remaining"),
                decision.remaining.to_string(),
            ));
            builder.insert_header((
                header::HeaderName::from_static("x-rate-limit-reset"),
                decision.reset_after.as_secs().to_string(),
            ));

            let response = builder.json(body);
            let (req, _) = req.into_parts();
            return Box::pin(async move {
                let res = ServiceResponse::new(req, response).map_into_left_body();
                Ok(res)
            });
        }

        let fut = self.service.call(req);
        Box::pin(async move {
            let res = fut.await?;
            Ok(res.map_into_right_body())
        })
    }
}
