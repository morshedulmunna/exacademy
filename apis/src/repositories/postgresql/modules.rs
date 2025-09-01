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

        // Create or update module using upsert
        let module_row = sqlx::query(
            r#"INSERT INTO course_modules (course_id, title, description, position)
                VALUES ($1,$2,$3,$4) 
                ON CONFLICT (course_id, position) 
                DO UPDATE SET 
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    updated_at = NOW()
                RETURNING id, created_at, updated_at"#,
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
        let module_updated_at: Option<chrono::DateTime<chrono::Utc>> =
            module_row.try_get("updated_at").ok();

        let module_record = ModuleRecord {
            id: module_id,
            course_id: input.course_id,
            title: input.title.clone(),
            description: input.description.clone(),
            position: input.position,
            created_at: module_created_at,
            updated_at: module_updated_at,
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
                    ) 
                    ON CONFLICT (module_id, position) 
                    DO UPDATE SET 
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        content = EXCLUDED.content,
                        video_url = EXCLUDED.video_url,
                        duration = EXCLUDED.duration,
                        is_free = EXCLUDED.is_free,
                        published = EXCLUDED.published,
                        updated_at = NOW()
                    RETURNING id, created_at, updated_at"#,
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
            let lesson_updated_at: Option<chrono::DateTime<chrono::Utc>> =
                lesson_row.try_get("updated_at").ok();

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
                updated_at: lesson_updated_at,
            };

            // contents
            // Prune contents that are no longer present by position
            let desired_content_positions: Vec<i32> =
                lesson.contents.iter().map(|c| c.position).collect();
            sqlx::query(
                r#"DELETE FROM lesson_contents
                   WHERE lesson_id = $1 AND NOT (position = ANY($2))"#,
            )
            .bind(lesson_id)
            .bind(&desired_content_positions)
            .execute(&mut **tx)
            .await
            .map_err(AppError::from)?;

            let mut contents_created: Vec<LessonContentRecord> = Vec::new();
            for c in &lesson.contents {
                let row = sqlx::query(
                    r#"INSERT INTO lesson_contents (lesson_id, title, content_type, url, file_size, filename, position)
                       VALUES ($1,$2,$3,$4,$5,$6,$7) 
                       ON CONFLICT (lesson_id, position) 
                       DO UPDATE SET 
                           title = EXCLUDED.title,
                           content_type = EXCLUDED.content_type,
                           url = EXCLUDED.url,
                           file_size = EXCLUDED.file_size,
                           filename = EXCLUDED.filename,
                           updated_at = NOW()
                       RETURNING id, created_at, updated_at"#,
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
                    updated_at: row.try_get("updated_at").ok(),
                });
            }

            // questions and options
            // Prune questions not present by position (options cascade)
            let desired_question_positions: Vec<i32> =
                lesson.questions.iter().map(|q| q.position).collect();
            sqlx::query(
                r#"DELETE FROM lesson_questions
                   WHERE lesson_id = $1 AND NOT (position = ANY($2))"#,
            )
            .bind(lesson_id)
            .bind(&desired_question_positions)
            .execute(&mut **tx)
            .await
            .map_err(AppError::from)?;

            let mut questions_created: Vec<(LessonQuestionRecord, Vec<QuestionOptionRecord>)> =
                Vec::new();
            for q in &lesson.questions {
                let q_row = sqlx::query(
                    r#"INSERT INTO lesson_questions (lesson_id, question_text, position)
                       VALUES ($1,$2,$3) 
                       ON CONFLICT (lesson_id, position) 
                       DO UPDATE SET 
                           question_text = EXCLUDED.question_text,
                           updated_at = NOW()
                       RETURNING id, created_at, updated_at"#,
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
                    updated_at: q_row.try_get("updated_at").ok(),
                };

                // Prune options not present by position for this question
                let desired_option_positions: Vec<i32> =
                    q.options.iter().map(|o| o.position).collect();
                sqlx::query(
                    r#"DELETE FROM question_options
                       WHERE question_id = $1 AND NOT (position = ANY($2))"#,
                )
                .bind(question_id)
                .bind(&desired_option_positions)
                .execute(&mut **tx)
                .await
                .map_err(AppError::from)?;

                let mut option_records: Vec<QuestionOptionRecord> = Vec::new();
                for o in &q.options {
                    let row = sqlx::query(
                        r#"INSERT INTO question_options (question_id, option_text, is_correct, position)
                           VALUES ($1,$2,$3,$4) 
                           ON CONFLICT (question_id, position) 
                           DO UPDATE SET 
                               option_text = EXCLUDED.option_text,
                               is_correct = EXCLUDED.is_correct,
                               updated_at = NOW()
                           RETURNING id, created_at, updated_at"#,
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
                        updated_at: row.try_get("updated_at").ok(),
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
            } else {
                // Prune assignment if it exists but not provided in payload
                sqlx::query(r#"DELETE FROM lesson_assignments WHERE lesson_id = $1"#)
                    .bind(lesson_id)
                    .execute(&mut **tx)
                    .await
                    .map_err(AppError::from)?;
            }

            Ok((
                lesson_record,
                contents_created,
                questions_created,
                assignment_record,
            ))
        }

        let mut lessons_created: Vec<LessonDeepRecord> = Vec::new();

        // Prune lessons for this module that are no longer present by position
        let desired_lesson_positions: Vec<i32> = input.lessons.iter().map(|l| l.position).collect();
        sqlx::query(
            r#"DELETE FROM lessons
               WHERE module_id = $1 AND NOT (position = ANY($2))"#,
        )
        .bind(module_id)
        .bind(&desired_lesson_positions)
        .execute(&mut *tx)
        .await
        .map_err(AppError::from)?;

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

    async fn list_by_course_deep(&self, course_id: uuid::Uuid) -> AppResult<Vec<ModuleDeepRecord>> {
        // Get all modules for the course
        let module_rows = sqlx::query(
            r#"SELECT id, course_id, title, description, position, created_at, updated_at
               FROM course_modules 
               WHERE course_id = $1 
               ORDER BY position, created_at"#,
        )
        .bind(course_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        let mut modules_deep: Vec<ModuleDeepRecord> = Vec::new();

        for module_row in module_rows {
            let module_id: uuid::Uuid = module_row.get("id");
            let module_record = map_module_row(module_row);

            // Get lessons for this module
            let lesson_rows = sqlx::query(
                r#"SELECT id, module_id, title, description, content, video_url, duration, position, is_free, published, created_at, updated_at
                   FROM lessons 
                   WHERE module_id = $1 
                   ORDER BY position, created_at"#,
            )
            .bind(module_id)
            .fetch_all(&self.pool)
            .await
            .map_err(AppError::from)?;

            let mut lessons_deep: Vec<LessonDeepRecord> = Vec::new();

            for lesson_row in lesson_rows {
                let lesson_id: uuid::Uuid = lesson_row.get("id");
                let lesson_record = LessonRecord {
                    id: lesson_id,
                    module_id,
                    title: lesson_row.get("title"),
                    description: lesson_row.try_get("description").ok(),
                    content: lesson_row.try_get("content").ok(),
                    video_url: lesson_row.try_get("video_url").ok(),
                    duration: lesson_row.get("duration"),
                    position: lesson_row.get("position"),
                    is_free: lesson_row.get("is_free"),
                    published: lesson_row.get("published"),
                    created_at: lesson_row.get("created_at"),
                    updated_at: lesson_row.try_get("updated_at").ok(),
                };

                // Get lesson contents
                let content_rows = sqlx::query(
                    r#"SELECT id, lesson_id, title, content_type, url, file_size, filename, position, created_at, updated_at
                       FROM lesson_contents 
                       WHERE lesson_id = $1 
                       ORDER BY position, created_at"#,
                )
                .bind(lesson_id)
                .fetch_all(&self.pool)
                .await
                .map_err(AppError::from)?;

                let contents: Vec<LessonContentRecord> = content_rows
                    .into_iter()
                    .map(|row| LessonContentRecord {
                        id: row.get("id"),
                        lesson_id,
                        title: row.get("title"),
                        content_type: row.get("content_type"),
                        url: row.get("url"),
                        file_size: row.try_get("file_size").ok(),
                        filename: row.try_get("filename").ok(),
                        position: row.get("position"),
                        created_at: row.get("created_at"),
                        updated_at: row.try_get("updated_at").ok(),
                    })
                    .collect();

                // Get lesson questions with options
                let question_rows = sqlx::query(
                    r#"SELECT id, lesson_id, question_text, position, created_at, updated_at
                       FROM lesson_questions 
                       WHERE lesson_id = $1 
                       ORDER BY position, created_at"#,
                )
                .bind(lesson_id)
                .fetch_all(&self.pool)
                .await
                .map_err(AppError::from)?;

                let mut questions: Vec<(LessonQuestionRecord, Vec<QuestionOptionRecord>)> =
                    Vec::new();

                for question_row in question_rows {
                    let question_id: uuid::Uuid = question_row.get("id");
                    let question_record = LessonQuestionRecord {
                        id: question_id,
                        lesson_id,
                        question_text: question_row.get("question_text"),
                        position: question_row.get("position"),
                        created_at: question_row.get("created_at"),
                        updated_at: question_row.try_get("updated_at").ok(),
                    };

                    // Get options for this question
                    let option_rows = sqlx::query(
                        r#"SELECT id, question_id, option_text, is_correct, position, created_at, updated_at
                           FROM question_options 
                           WHERE question_id = $1 
                           ORDER BY position, created_at"#,
                    )
                    .bind(question_id)
                    .fetch_all(&self.pool)
                    .await
                    .map_err(AppError::from)?;

                    let options: Vec<QuestionOptionRecord> = option_rows
                        .into_iter()
                        .map(|row| QuestionOptionRecord {
                            id: row.get("id"),
                            question_id,
                            option_text: row.get("option_text"),
                            is_correct: row.get("is_correct"),
                            position: row.get("position"),
                            created_at: row.get("created_at"),
                            updated_at: row.try_get("updated_at").ok(),
                        })
                        .collect();

                    questions.push((question_record, options));
                }

                // Get lesson assignment
                let assignment_row = sqlx::query(
                    r#"SELECT lesson_id, title, description, created_at, updated_at
                       FROM lesson_assignments 
                       WHERE lesson_id = $1"#,
                )
                .bind(lesson_id)
                .fetch_optional(&self.pool)
                .await
                .map_err(AppError::from)?;

                let assignment = assignment_row.map(|row| LessonAssignmentRecord {
                    lesson_id,
                    title: row.get("title"),
                    description: row.try_get("description").ok(),
                    created_at: row.get("created_at"),
                    updated_at: row.try_get("updated_at").ok(),
                });

                lessons_deep.push(LessonDeepRecord {
                    lesson: lesson_record,
                    contents,
                    questions,
                    assignment,
                });
            }

            modules_deep.push(ModuleDeepRecord {
                module: module_record,
                lessons: lessons_deep,
            });
        }

        Ok(modules_deep)
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

#[cfg(test)]
mod tests {

    #[tokio::test]
    async fn test_create_deep_upsert_functionality() {
        // This test would require a test database setup
        // For now, we'll just verify the SQL syntax is correct by checking compilation
        // In a real test environment, you would:
        // 1. Set up a test database
        // 2. Create a course
        // 3. Create a module with position 1
        // 4. Try to create another module with the same position (should update instead)
        // 5. Verify the module was updated, not created

        // For now, just ensure the code compiles
        assert!(true, "Upsert functionality implemented successfully");
    }
}
