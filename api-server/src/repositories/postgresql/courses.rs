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
                    price, original_price, duration, lessons, featured, instructor_id
                ) VALUES (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
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
        .bind(input.lessons)
        .bind(input.featured)
        .bind(&input.instructor_id)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn list_all(&self) -> AppResult<Vec<CourseRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, slug, title, description, excerpt, thumbnail,
                       price, original_price, duration, lessons, students,
                       published, featured, view_count, instructor_id,
                       published_at, created_at, updated_at
               FROM courses
               ORDER BY created_at DESC"#,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_course_row).collect())
    }

    async fn list_by_instructor(&self, instructor_id: uuid::Uuid) -> AppResult<Vec<CourseRecord>> {
        let rows = sqlx::query(
            r#"SELECT id, slug, title, description, excerpt, thumbnail,
                       price, original_price, duration, lessons, students,
                       published, featured, view_count, instructor_id,
                       published_at, created_at, updated_at
               FROM courses
               WHERE instructor_id = $1
               ORDER BY created_at DESC"#,
        )
        .bind(instructor_id)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rows.into_iter().map(map_course_row).collect())
    }

    async fn list_by_instructor_paginated(
        &self,
        instructor_id: uuid::Uuid,
        offset: i64,
        limit: i64,
    ) -> AppResult<(Vec<CourseRecord>, i64)> {
        // fetch items
        let rows = sqlx::query(
            r#"SELECT id, slug, title, description, excerpt, thumbnail,
                       price, original_price, duration, lessons, students,
                       published, featured, view_count, instructor_id,
                       published_at, created_at, updated_at
               FROM courses
               WHERE instructor_id = $1
               ORDER BY created_at DESC
               OFFSET $2 LIMIT $3"#,
        )
        .bind(instructor_id)
        .bind(offset)
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        // fetch total count for this instructor
        let count_row: (i64,) =
            sqlx::query_as(r#"SELECT COUNT(*) as count FROM courses WHERE instructor_id = $1"#)
                .bind(instructor_id)
                .fetch_one(&self.pool)
                .await
                .map_err(AppError::from)?;

        let items: Vec<CourseRecord> = rows.into_iter().map(map_course_row).collect();
        Ok((items, count_row.0))
    }

    async fn list_paginated(&self, offset: i64, limit: i64) -> AppResult<(Vec<CourseRecord>, i64)> {
        // fetch items
        let rows = sqlx::query(
            r#"SELECT id, slug, title, description, excerpt, thumbnail,
                       price, original_price, duration, lessons, students,
                       published, featured, view_count, instructor_id,
                       published_at, created_at, updated_at
               FROM courses
               ORDER BY created_at DESC
               OFFSET $1 LIMIT $2"#,
        )
        .bind(offset)
        .bind(limit)
        .fetch_all(&self.pool)
        .await
        .map_err(AppError::from)?;

        // fetch total count
        let count_row: (i64,) = sqlx::query_as(r#"SELECT COUNT(*) as count FROM courses"#)
            .fetch_one(&self.pool)
            .await
            .map_err(AppError::from)?;

        let items: Vec<CourseRecord> = rows.into_iter().map(map_course_row).collect();
        Ok((items, count_row.0))
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<CourseRecord>> {
        let row = sqlx::query(
            r#"SELECT id, slug, title, description, excerpt, thumbnail,
                       price, original_price, duration, lessons, students,
                       published, featured, view_count, instructor_id,
                       published_at, created_at, updated_at
               FROM courses WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_course_row))
    }

    async fn find_by_slug(&self, slug: &str) -> AppResult<Option<CourseRecord>> {
        let row = sqlx::query(
            r#"SELECT id, slug, title, description, excerpt, thumbnail,
                       price, original_price, duration, lessons, students,
                       published, featured, view_count, instructor_id,
                       published_at, created_at, updated_at
               FROM courses WHERE slug = $1"#,
        )
        .bind(slug)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(row.map(map_course_row))
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
                    students = COALESCE($9, students),
                    published = COALESCE($10, published),
                    featured = COALESCE($11, featured)
                WHERE id = $12
                RETURNING id, slug, title, description, excerpt, thumbnail,
                          price, original_price, duration, lessons, students,
                          published, featured, view_count, instructor_id,
                          published_at, created_at, updated_at"#,
        )
        .bind(input.title)
        .bind(input.description)
        .bind(input.excerpt)
        .bind(input.thumbnail)
        .bind(input.price)
        .bind(input.original_price)
        .bind(input.duration)
        .bind(input.lessons)
        .bind(input.students)
        .bind(input.published)
        .bind(input.featured)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_course_row))
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

fn map_course_row(row: sqlx::postgres::PgRow) -> CourseRecord {
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
        students: row.get("students"),
        published: row.get("published"),
        featured: row.get("featured"),
        view_count: row.get("view_count"),
        instructor_id: row.try_get("instructor_id").ok(),
        published_at: row.try_get("published_at").ok(),
        created_at: row.get("created_at"),
        updated_at: row.try_get("updated_at").ok(),
    }
}
