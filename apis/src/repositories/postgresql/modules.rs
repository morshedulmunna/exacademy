use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::lesson_assignments::LessonAssignmentRecord;
use crate::repositories::lesson_contents::LessonContentRecord;
use crate::repositories::lesson_questions::{LessonQuestionRecord, QuestionOptionRecord};
use crate::repositories::lessons::LessonRecord;
use crate::repositories::modules::{
    CreateLessonDeepData, CreateModuleDeepRecord, CreateModuleRecord, LessonDeepRecord,
    ModuleDeepRecord, ModuleRecord, ModulesRepository, UpdateModuleRecord,
};

pub struct PostgresModulesRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl ModulesRepository for PostgresModulesRepository {
    async fn create(&self, input: CreateModuleRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO course_modules (course_id, title, description, position)
                VALUES ($1,$2,$3,$4)
                RETURNING id"#,
        )
        .bind(input.course_id)
        .bind(&input.title)
        .bind(&input.description)
        .bind(input.position)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<ModuleRecord>> {
        let row = sqlx::query(
            r#"SELECT id, course_id, title, description, position, created_at, updated_at
               FROM course_modules WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_module_row))
    }

    async fn list_by_course(&self, course_id: uuid::Uuid) -> AppResult<Vec<ModuleRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, course_id, title, description, position, created_at, updated_at
               FROM course_modules WHERE course_id = $1 ORDER BY position ASC, created_at ASC"#,
        )
        .bind(course_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_module_row).collect())
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateModuleRecord,
    ) -> AppResult<Option<ModuleRecord>> {
        let row = sqlx::query(
            r#"UPDATE course_modules SET
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    position = COALESCE($3, position)
               WHERE id = $4
               RETURNING id, course_id, title, description, position, created_at, updated_at"#,
        )
        .bind(input.title)
        .bind(input.description)
        .bind(input.position)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_module_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM course_modules WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }

    async fn create_deep(&self, input: CreateModuleDeepRecord) -> AppResult<ModuleDeepRecord> {
        // Start a transaction so we can guarantee atomicity of the whole module graph
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;

        // Create module
        let module_row = sqlx::query(
            r#"INSERT INTO course_modules (course_id, title, description, position)
                VALUES ($1,$2,$3,$4) RETURNING id, created_at"#,
        )
        .bind(input.course_id)
        .bind(&input.title)
        .bind(&input.description)
        .bind(input.position)
        .fetch_one(&mut *tx)
        .await
        .map_err(AppError::from)?;
        let module_id: uuid::Uuid = module_row.get("id");
        let module_created_at: chrono::DateTime<chrono::Utc> = module_row.get("created_at");

        let module_record = ModuleRecord {
            id: module_id,
            course_id: input.course_id,
            title: input.title.clone(),
            description: input.description.clone(),
            position: input.position,
            created_at: module_created_at,
            updated_at: None,
        };

        // Helper to insert a lesson and its nested relations
        async fn insert_lesson(
            tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
            module_id: uuid::Uuid,
            lesson: &CreateLessonDeepData,
        ) -> Result<
            (
                LessonRecord,
                Vec<LessonContentRecord>,
                Vec<(LessonQuestionRecord, Vec<QuestionOptionRecord>)>,
                Option<LessonAssignmentRecord>,
            ),
            AppError,
        > {
            let lesson_row = sqlx::query(
                r#"INSERT INTO lessons (
                        module_id, title, description, content, video_url,
                        duration, position, is_free, published
                    ) VALUES (
                        $1,$2,$3,$4,$5,$6,$7,$8,$9
                    ) RETURNING id, created_at"#,
            )
            .bind(module_id)
            .bind(&lesson.title)
            .bind(&lesson.description)
            .bind(&lesson.content)
            .bind(&lesson.video_url)
            .bind(&lesson.duration)
            .bind(lesson.position)
            .bind(lesson.is_free)
            .bind(lesson.published)
            .fetch_one(&mut **tx)
            .await
            .map_err(AppError::from)?;
            let lesson_id: uuid::Uuid = lesson_row.get("id");
            let lesson_created_at: chrono::DateTime<chrono::Utc> = lesson_row.get("created_at");

            let lesson_record = LessonRecord {
                id: lesson_id,
                module_id,
                title: lesson.title.clone(),
                description: lesson.description.clone(),
                content: lesson.content.clone(),
                video_url: lesson.video_url.clone(),
                duration: lesson.duration.clone(),
                position: lesson.position,
                is_free: lesson.is_free,
                published: lesson.published,
                created_at: lesson_created_at,
                updated_at: None,
            };

            // contents
            let mut contents_created: Vec<LessonContentRecord> = Vec::new();
            for c in &lesson.contents {
                let row = sqlx::query(
                    r#"INSERT INTO lesson_contents (lesson_id, title, content_type, url, file_size, filename, position)
                       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, created_at"#,
                )
                .bind(lesson_id)
                .bind(&c.title)
                .bind(&c.content_type)
                .bind(&c.url)
                .bind(c.file_size)
                .bind(&c.filename)
                .bind(c.position)
                .fetch_one(&mut **tx)
                .await
                .map_err(AppError::from)?;
                contents_created.push(LessonContentRecord {
                    id: row.get("id"),
                    lesson_id,
                    title: c.title.clone(),
                    content_type: c.content_type.clone(),
                    url: c.url.clone(),
                    file_size: c.file_size,
                    filename: c.filename.clone(),
                    position: c.position,
                    created_at: row.get("created_at"),
                    updated_at: None,
                });
            }

            // questions and options
            let mut questions_created: Vec<(LessonQuestionRecord, Vec<QuestionOptionRecord>)> =
                Vec::new();
            for q in &lesson.questions {
                let q_row = sqlx::query(
                    r#"INSERT INTO lesson_questions (lesson_id, question_text, position)
                       VALUES ($1,$2,$3) RETURNING id, created_at"#,
                )
                .bind(lesson_id)
                .bind(&q.question_text)
                .bind(q.position)
                .fetch_one(&mut **tx)
                .await
                .map_err(AppError::from)?;
                let question_id: uuid::Uuid = q_row.get("id");
                let question_rec = LessonQuestionRecord {
                    id: question_id,
                    lesson_id,
                    question_text: q.question_text.clone(),
                    position: q.position,
                    created_at: q_row.get("created_at"),
                    updated_at: None,
                };

                let mut option_records: Vec<QuestionOptionRecord> = Vec::new();
                for o in &q.options {
                    let row = sqlx::query(
                        r#"INSERT INTO question_options (question_id, option_text, is_correct, position)
                           VALUES ($1,$2,$3,$4) RETURNING id, created_at"#,
                    )
                    .bind(question_id)
                    .bind(&o.option_text)
                    .bind(o.is_correct)
                    .bind(o.position)
                    .fetch_one(&mut **tx)
                    .await
                    .map_err(AppError::from)?;
                    option_records.push(QuestionOptionRecord {
                        id: row.get("id"),
                        question_id,
                        option_text: o.option_text.clone(),
                        is_correct: o.is_correct,
                        position: o.position,
                        created_at: row.get("created_at"),
                        updated_at: None,
                    });
                }
                questions_created.push((question_rec, option_records));
            }

            // optional assignment
            let mut assignment_record: Option<LessonAssignmentRecord> = None;
            if let Some(a) = &lesson.assignment {
                let row = sqlx::query(
                    r#"INSERT INTO lesson_assignments (lesson_id, title, description)
                       VALUES ($1,$2,$3)
                       ON CONFLICT (lesson_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description
                       RETURNING title, description, created_at, updated_at"#,
                )
                .bind(lesson_id)
                .bind(&a.title)
                .bind(&a.description)
                .fetch_one(&mut **tx)
                .await
                .map_err(AppError::from)?;
                assignment_record = Some(LessonAssignmentRecord {
                    lesson_id,
                    title: row.get("title"),
                    description: row.try_get("description").ok(),
                    created_at: row.get("created_at"),
                    updated_at: row.try_get("updated_at").ok(),
                });
            }

            Ok((
                lesson_record,
                contents_created,
                questions_created,
                assignment_record,
            ))
        }

        let mut lessons_created: Vec<LessonDeepRecord> = Vec::new();
        for lesson in &input.lessons {
            let (lrec, contents, questions, assignment) =
                insert_lesson(&mut tx, module_id, lesson).await?;
            lessons_created.push(LessonDeepRecord {
                lesson: lrec,
                contents,
                questions,
                assignment,
            });
        }

        tx.commit().await.map_err(AppError::from)?;
        Ok(ModuleDeepRecord {
            module: module_record,
            lessons: lessons_created,
        })
    }
}

fn map_module_row(row: sqlx::postgres::PgRow) -> ModuleRecord {
    ModuleRecord {
        id: row.get("id"),
        course_id: row.get("course_id"),
        title: row.get("title"),
        description: row.try_get("description").ok(),
        position: row.get("position"),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}
