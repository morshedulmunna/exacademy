//! Course activity gRPC service implementation
//!
//! This module contains the gRPC service implementation for course activity streaming.

use crate::configs::app_context::AppContext;
use crate::interfaces::grpc::schema::{
    ActivityType, CourseActivityEvent, GetCourseActivitiesRequest, GetCourseActivitiesResponse,
    GetUserCourseActivitiesRequest, GetUserCourseActivitiesResponse, StreamCourseActivitiesRequest,
    course_activity_service_server::CourseActivityService,
};
use crate::pkg::error::AppResult;
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::broadcast;
use tonic::{Request, Response, Status};
use uuid::Uuid;

/// Course activity event for internal use
#[derive(Debug, Clone)]
pub struct InternalActivityEvent {
    pub id: String,
    pub course_id: String,
    pub user_id: String,
    pub user_name: String,
    pub user_avatar_url: Option<String>,
    pub activity_type: ActivityType,
    pub activity_description: String,
    pub metadata: HashMap<String, String>,
    pub timestamp: i64,
}

impl From<InternalActivityEvent> for CourseActivityEvent {
    fn from(event: InternalActivityEvent) -> Self {
        CourseActivityEvent {
            id: event.id,
            course_id: event.course_id,
            user_id: event.user_id,
            user_name: event.user_name,
            user_avatar_url: event.user_avatar_url.unwrap_or_default(),
            activity_type: event.activity_type as i32,
            activity_description: event.activity_description,
            metadata: event.metadata,
            timestamp: event.timestamp,
        }
    }
}

/// Course activity service implementation
pub struct CourseActivityServiceImpl {
    #[allow(dead_code)]
    app_context: Arc<AppContext>,
    activity_broadcaster: broadcast::Sender<InternalActivityEvent>,
}

impl CourseActivityServiceImpl {
    /// Create a new course activity service
    pub fn new(app_context: Arc<AppContext>) -> Self {
        let (tx, _) = broadcast::channel(1000);
        Self {
            app_context,
            activity_broadcaster: tx,
        }
    }

    /// Get the broadcast sender for publishing activities
    pub fn get_broadcast_sender(&self) -> broadcast::Sender<InternalActivityEvent> {
        self.activity_broadcaster.clone()
    }

    /// Publish a new activity event
    pub fn publish_activity(&self, event: InternalActivityEvent) -> AppResult<()> {
        let _ = self.activity_broadcaster.send(event);
        Ok(())
    }
}

#[tonic::async_trait]
impl CourseActivityService for CourseActivityServiceImpl {
    type StreamCourseActivitiesStream = std::pin::Pin<
        Box<dyn futures::Stream<Item = Result<CourseActivityEvent, Status>> + Send + 'static>,
    >;

    /// Stream course activities in real-time
    async fn stream_course_activities(
        &self,
        request: Request<StreamCourseActivitiesRequest>,
    ) -> Result<Response<Self::StreamCourseActivitiesStream>, Status> {
        let req = request.into_inner();
        let course_id = req.course_id;
        let user_filter = req.user_id;
        let activity_types = req.activity_types;

        // Create a receiver for this stream
        let mut rx = self.activity_broadcaster.subscribe();

        // Create the streaming response
        let stream = async_stream::stream! {
            loop {
                match rx.recv().await {
                    Ok(event) => {
                        // Apply filters
                        if event.course_id != course_id {
                            continue;
                        }

                        if let Some(ref user_id) = user_filter {
                            if event.user_id != *user_id {
                                continue;
                            }
                        }

                        if !activity_types.is_empty() {
                            let event_type = ActivityType::try_from(event.activity_type as i32)
                                .unwrap_or(ActivityType::Unspecified);
                            if !activity_types.contains(&(event_type as i32)) {
                                continue;
                            }
                        }

                        yield Ok(CourseActivityEvent::from(event));
                    }
                    Err(broadcast::error::RecvError::Closed) => {
                        break;
                    }
                    Err(broadcast::error::RecvError::Lagged(_)) => {
                        // Skip lagged messages
                        continue;
                    }
                }
            }
        };

        Ok(Response::new(Box::pin(stream)))
    }

    /// Get recent course activities
    async fn get_course_activities(
        &self,
        request: Request<GetCourseActivitiesRequest>,
    ) -> Result<Response<GetCourseActivitiesResponse>, Status> {
        let req = request.into_inner();
        let _course_id = req.course_id;
        let _limit = req.limit as i64;
        let _since_timestamp = req.since_timestamp;

        // For now, return empty response - in a real implementation,
        // you would query the database for recent activities
        let response = GetCourseActivitiesResponse {
            activities: vec![],
            total_count: 0,
            has_more: false,
        };

        Ok(Response::new(response))
    }

    /// Get user's course activities
    async fn get_user_course_activities(
        &self,
        request: Request<GetUserCourseActivitiesRequest>,
    ) -> Result<Response<GetUserCourseActivitiesResponse>, Status> {
        let req = request.into_inner();
        let _user_id = req.user_id;
        let _course_id = req.course_id;
        let _limit = req.limit as i64;
        let _since_timestamp = req.since_timestamp;

        // For now, return empty response - in a real implementation,
        // you would query the database for user's activities
        let response = GetUserCourseActivitiesResponse {
            activities: vec![],
            total_count: 0,
            has_more: false,
        };

        Ok(Response::new(response))
    }
}

/// Helper function to create activity events
pub fn create_activity_event(
    course_id: Uuid,
    user_id: Uuid,
    user_name: String,
    user_avatar_url: Option<String>,
    activity_type: ActivityType,
    activity_description: String,
    metadata: HashMap<String, String>,
) -> InternalActivityEvent {
    InternalActivityEvent {
        id: Uuid::new_v4().to_string(),
        course_id: course_id.to_string(),
        user_id: user_id.to_string(),
        user_name,
        user_avatar_url,
        activity_type,
        activity_description,
        metadata,
        timestamp: chrono::Utc::now().timestamp_millis(),
    }
}
