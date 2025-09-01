use axum::{Extension, Json, extract::Path, http::StatusCode};

use crate::applications::lessons::questions as service;
use crate::configs::app_context::AppContext;
use crate::pkg::Response;
use crate::pkg::error::AppResult;
use crate::pkg::validators::ValidatedJson;
use crate::types::course_types::{CreateLessonQuestionRequest, CreateQuestionOptionRequest, LessonQuestion, QuestionOption, UpdateLessonQuestionRequest, UpdateQuestionOptionRequest};

// Questions endpoints
#[utoipa::path(
    post,
    path = "/api/lessons/:lesson_id/questions",
    request_body = CreateLessonQuestionRequest,
    responses((status = 201, description = "Created question", body = uuid::Uuid)),
    tag = "Lessons"
)]
pub async fn create_question(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(_lesson_id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<CreateLessonQuestionRequest>,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    let id = service::create_question(ctx.repos.lesson_questions.as_ref(), input).await?;
    let body = Response::with_data("Created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}

#[utoipa::path(
    get,
    path = "/api/lessons/:lesson_id/questions",
    responses((status = 200, description = "List questions", body = [LessonQuestion])),
    tag = "Lessons"
)]
pub async fn list_questions(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(lesson_id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<Vec<LessonQuestion>>>> {
    let items = service::list_questions(ctx.repos.lesson_questions.as_ref(), lesson_id).await?;
    let body = Response::with_data("OK", items, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    patch,
    path = "/api/lesson-questions/:id",
    request_body = UpdateLessonQuestionRequest,
    responses((status = 200, description = "Updated question", body = LessonQuestion)),
    tag = "Lessons"
)]
pub async fn update_question(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<UpdateLessonQuestionRequest>,
) -> AppResult<Json<Response<Option<LessonQuestion>>>> {
    let updated = service::update_question(ctx.repos.lesson_questions.as_ref(), id, input).await?;
    let body = Response::with_data("OK", updated, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    delete,
    path = "/api/lesson-questions/:id",
    responses((status = 200, description = "Deleted question")),
    tag = "Lessons"
)]
pub async fn delete_question(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<()>>> {
    service::delete_question(ctx.repos.lesson_questions.as_ref(), id).await?;
    let body = Response::with_message("Deleted", StatusCode::OK.as_u16());
    Ok(Json(body))
}

// Options endpoints
#[utoipa::path(
    post,
    path = "/api/lesson-questions/:question_id/options",
    request_body = CreateQuestionOptionRequest,
    responses((status = 201, description = "Created option", body = uuid::Uuid)),
    tag = "Lessons"
)]
pub async fn create_option(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(_question_id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<CreateQuestionOptionRequest>,
) -> AppResult<(StatusCode, Json<Response<uuid::Uuid>>)> {
    let id = service::create_option(ctx.repos.lesson_questions.as_ref(), input).await?;
    let body = Response::with_data("Created", id, StatusCode::CREATED.as_u16());
    Ok((StatusCode::CREATED, Json(body)))
}

#[utoipa::path(
    get,
    path = "/api/lesson-questions/:question_id/options",
    responses((status = 200, description = "List options", body = [QuestionOption])),
    tag = "Lessons"
)]
pub async fn list_options(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(question_id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<Vec<QuestionOption>>>> {
    let items = service::list_options(ctx.repos.lesson_questions.as_ref(), question_id).await?;
    let body = Response::with_data("OK", items, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    patch,
    path = "/api/question-options/:id",
    request_body = UpdateQuestionOptionRequest,
    responses((status = 200, description = "Updated option", body = QuestionOption)),
    tag = "Lessons"
)]
pub async fn update_option(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
    ValidatedJson(input): ValidatedJson<UpdateQuestionOptionRequest>,
) -> AppResult<Json<Response<Option<QuestionOption>>>> {
    let updated = service::update_option(ctx.repos.lesson_questions.as_ref(), id, input).await?;
    let body = Response::with_data("OK", updated, StatusCode::OK.as_u16());
    Ok(Json(body))
}

#[utoipa::path(
    delete,
    path = "/api/question-options/:id",
    responses((status = 200, description = "Deleted option")),
    tag = "Lessons"
)]
pub async fn delete_option(
    Extension(ctx): Extension<std::sync::Arc<AppContext>>,
    Path(id): Path<uuid::Uuid>,
) -> AppResult<Json<Response<()>>> {
    service::delete_option(ctx.repos.lesson_questions.as_ref(), id).await?;
    let body = Response::with_message("Deleted", StatusCode::OK.as_u16());
    Ok(Json(body))
}


