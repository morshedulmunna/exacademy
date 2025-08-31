use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::courses::{
    CourseRecord, CoursesRepository, CreateCourseRecord, UpdateCourseRecord,
};

pub struct PostgresCoursesRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl CoursesRepository for PostgresCoursesRepository {
    async fn create(&self, input: CreateCourseRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO courses (
                    slug, title, description, excerpt, thumbnail,
                    price, original_price, duration, featured, published, status, instructor_id
                ) VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
                ) RETURNING id"#,
        )
        .bind(&input.slug)
        .bind(&input.title)
        .bind(&input.description)
        .bind(&input.excerpt)
        .bind(&input.thumbnail)
        .bind(input.price)
        .bind(&input.original_price)
        .bind(&input.duration)
        .bind(input.featured)
        .bind(input.published)
        .bind(&input.status)
        .bind(input.instructor_id)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn list_by_instructor_paginated(
        &self,
        instructor_id: uuid::Uuid,
        offset: i64,
        limit: i64,
    ) -> AppResult<(Vec<CourseRecord>, i64)> {
        // fetch items
        // Use a read-only transaction for a consistent snapshot across list and count
        let mut tx = self.pool.begin().await.map_err(AppError::from)?;
        sqlx::query("SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY")
            .execute(&mut *tx)
            .await
            .map_err(AppError::from)?;

        let rows = sqlx::query(
            r#"SELECT c.id, c.slug, c.title, c.description, c.excerpt, c.thumbnail,
                       c.price, c.original_price, c.duration, c.lessons,
                       c.published, c.status, c.featured, c.view_count,
                       c.instructor_id,
                       c.published_at, c.created_at, c.updated_at,
                       u.id as instructor_id_join, u.username as instructor_username,
                       u.full_name as instructor_full_name, u.avatar_url as instructor_avatar_url
               FROM courses c
               LEFT JOIN users u ON u.id = c.instructor_id
               WHERE c.instructor_id = $1
               ORDER BY c.created_at DESC
               OFFSET $2 LIMIT $3"#,
        )
        .bind(instructor_id)
        .bind(offset)
        .bind(limit)
        .fetch_all(&mut *tx)
        .await
        .map_err(AppError::from)?;

        // fetch total count for this instructor within the same snapshot
        let count_row: (i64,) =
            sqlx::query_as(r#"SELECT COUNT(*) as count FROM courses WHERE instructor_id = $1"#)
                .bind(instructor_id)
                .fetch_one(&mut *tx)
                .await
                .map_err(AppError::from)?;

        tx.commit().await.map_err(AppError::from)?;

        let items: Vec<CourseRecord> = rows
            .into_iter()
            .map(map_course_row_with_instructor)
            .collect();
        Ok((items, count_row.0))
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<CourseRecord>> {
        let row = sqlx::query(
            r#"SELECT c.id, c.slug, c.title, c.description, c.excerpt, c.thumbnail,
                       c.price, c.original_price, c.duration, c.lessons,
                       c.published, c.status, c.featured, c.view_count,
                       c.instructor_id,
                       c.published_at, c.created_at, c.updated_at,
                       u.id as instructor_id_join, u.username as instructor_username,
                       u.full_name as instructor_full_name, u.avatar_url as instructor_avatar_url
               FROM courses c
               LEFT JOIN users u ON u.id = c.instructor_id
               WHERE c.id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_course_row_with_instructor))
    }

    async fn find_by_slug(&self, slug: &str) -> AppResult<Option<CourseRecord>> {
        let row = sqlx::query(
            r#"SELECT c.id, c.slug, c.title, c.description, c.excerpt, c.thumbnail,
                       c.price, c.original_price, c.duration, c.lessons,
                       c.published, c.status, c.featured, c.view_count,
                       c.instructor_id,
                       c.published_at, c.created_at, c.updated_at,
                       u.id as instructor_id_join, u.username as instructor_username,
                       u.full_name as instructor_full_name, u.avatar_url as instructor_avatar_url
               FROM courses c
               LEFT JOIN users u ON u.id = c.instructor_id
               WHERE c.slug = $1"#,
        )
        .bind(slug)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_course_row_with_instructor))
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateCourseRecord,
    ) -> AppResult<Option<CourseRecord>> {
        let row = sqlx::query(
            r#"UPDATE courses SET
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    excerpt = COALESCE($3, excerpt),
                    thumbnail = COALESCE($4, thumbnail),
                    price = COALESCE($5, price),
                    original_price = COALESCE($6, original_price),
                    duration = COALESCE($7, duration),
                    lessons = COALESCE($8, lessons),
                    status = COALESCE($9, status),
                    featured = COALESCE($10, featured),
                    published = COALESCE($11, published)
                WHERE id = $12
                RETURNING id, slug, title, description, excerpt, thumbnail,
                          price, original_price, duration, lessons,
                          published, status, featured, view_count,
                          instructor_id, published_at, created_at, updated_at"#,
        )
        .bind(input.title)
        .bind(input.description)
        .bind(input.excerpt)
        .bind(input.thumbnail)
        .bind(input.price)
        .bind(input.original_price)
        .bind(input.duration)
        .bind(input.lessons)
        .bind(input.status)
        .bind(input.featured)
        .bind(input.published)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(|row| CourseRecord {
            id: row.get("id"),
            slug: row.get("slug"),
            title: row.get("title"),
            description: row.get("description"),
            excerpt: row.try_get("excerpt").ok(),
            thumbnail: row.try_get("thumbnail").ok(),
            price: row.get("price"),
            original_price: row.try_get("original_price").ok(),
            duration: row.get("duration"),
            lessons: row.get("lessons"),
            published: row.get("published"),
            featured: row.get("featured"),
            view_count: row.get("view_count"),
            status: row.get("status"),
            instructor_id: row.try_get("instructor_id").ok(),
            instructor: None,
            published_at: row.try_get("published_at").ok(),
            created_at: row.get("created_at"),
            updated_at: row.try_get("updated_at").ok(),
        }))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM courses WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }
}

fn map_course_row_with_instructor(row: sqlx::postgres::PgRow) -> CourseRecord {
    let instructor_id_opt: Option<uuid::Uuid> = row.try_get("instructor_id").ok();

    let instructor = match (
        row.try_get::<uuid::Uuid, _>("instructor_id_join").ok(),
        row.try_get::<String, _>("instructor_username").ok(),
        row.try_get::<Option<String>, _>("instructor_full_name")
            .ok()
            .flatten(),
        row.try_get::<Option<String>, _>("instructor_avatar_url")
            .ok()
            .flatten(),
    ) {
        (Some(id), Some(username), full_name, avatar_url) => {
            Some(crate::repositories::courses::InstructorSummary {
                id,
                username,
                full_name,
                avatar_url,
            })
        }
        _ => None,
    };

    CourseRecord {
        id: row.get("id"),
        slug: row.get("slug"),
        title: row.get("title"),
        description: row.get("description"),
        excerpt: row.try_get("excerpt").ok(),
        thumbnail: row.try_get("thumbnail").ok(),
        price: row.get("price"),
        original_price: row.try_get("original_price").ok(),
        duration: row.get("duration"),
        lessons: row.get("lessons"),
        published: row.get("published"),
        featured: row.get("featured"),
        view_count: row.get("view_count"),
        status: row.get("status"),
        instructor_id: instructor_id_opt,
        instructor,
        published_at: row.try_get("published_at").ok(),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}
