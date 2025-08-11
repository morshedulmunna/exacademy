use std::collections::HashMap;
use std::future::{Future, Ready, ready};
use std::pin::Pin;
use std::rc::Rc;
use std::task::{Context, Poll};
use std::time::Instant;

use actix_web::Error;
use actix_web::body::{BoxBody, EitherBody, MessageBody};
use actix_web::dev::{Service, ServiceRequest, ServiceResponse, Transform};
use actix_web::http::header;

use crate::pkg::logger::{LogLevel, get_logger};

/// Request logging middleware
///
/// Logs method, path, status, latency, client ip and user agent in a
/// structured JSON log using the global logger.
pub struct RequestLogger;

impl RequestLogger {
    pub fn new() -> Self {
        Self
    }
}

impl<S, B> Transform<S, ServiceRequest> for RequestLogger
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: MessageBody + 'static,
{
    type Response = ServiceResponse<EitherBody<BoxBody, B>>;
    type Error = Error;
    type Transform = RequestLoggerMiddleware<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ready(Ok(RequestLoggerMiddleware {
            service: Rc::new(service),
        }))
    }
}

pub struct RequestLoggerMiddleware<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for RequestLoggerMiddleware<S>
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
        let start = Instant::now();
        let method = req.method().to_string();
        let path = req.path().to_string();
        let peer_ip = req
            .connection_info()
            .realip_remote_addr()
            .unwrap_or("unknown")
            .to_string();
        let user_agent = req
            .headers()
            .get(header::USER_AGENT)
            .and_then(|h| h.to_str().ok())
            .unwrap_or("")
            .to_string();

        let fut = self.service.call(req);
        Box::pin(async move {
            match fut.await {
                Ok(res) => {
                    let status = res.status().as_u16() as i64;
                    let latency_ms = start.elapsed().as_millis() as i64;

                    let mut fields: HashMap<String, serde_json::Value> = HashMap::new();
                    fields.insert("method".to_string(), method.clone().into());
                    fields.insert("path".to_string(), path.clone().into());
                    fields.insert("status".to_string(), status.into());
                    fields.insert("latency_ms".to_string(), latency_ms.into());
                    fields.insert("ip".to_string(), peer_ip.clone().into());
                    if !user_agent.is_empty() {
                        fields.insert("user_agent".to_string(), user_agent.clone().into());
                    }

                    let logger = get_logger();
                    logger.log_with_fields(LogLevel::Info, "http_request", None, fields);

                    Ok(res.map_into_right_body())
                }
                Err(err) => {
                    // Do not convert the error here; let the global error handler do it.
                    Err(err)
                }
            }
        })
    }
}
