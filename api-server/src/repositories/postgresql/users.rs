use sqlx::Row;

use crate::pkg::error::{AppError, AppResult};
use crate::repositories::users::{CreateUserRecord, UpdateUserRecord, UserRecord, UsersRepository};

pub struct PostgresUsersRepository {
    pub pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait::async_trait]
impl UsersRepository for PostgresUsersRepository {
    async fn find_by_email(&self, email: &str) -> AppResult<Option<UserRecord>> {
        let row = sqlx::query(
            r#"SELECT id, username, email, password_hash, role,
                first_name, last_name, full_name, avatar_url, is_active, is_blocked, created_at
               FROM users WHERE email = $1"#,
        )
        .bind(email)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_user_row))
    }

    async fn find_by_id(&self, id: uuid::Uuid) -> AppResult<Option<UserRecord>> {
        let row = sqlx::query(
            r#"SELECT id, username, email, password_hash, role,
                first_name, last_name, full_name, avatar_url, is_active, is_blocked, created_at
               FROM users WHERE id = $1"#,
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_user_row))
    }

    async fn create(&self, input: CreateUserRecord) -> AppResult<uuid::Uuid> {
        let rec = sqlx::query(
            r#"INSERT INTO users (username, email, password_hash, role)
                VALUES ($1, $2, $3, $4)
                RETURNING id"#,
        )
        .bind(&input.username)
        .bind(&input.email)
        .bind(&input.password_hash)
        .bind(&input.role)
        .fetch_one(&self.pool)
        .await
        .map_err(AppError::from)?;
        Ok(rec.get("id"))
    }

    async fn update_partial(
        &self,
        id: uuid::Uuid,
        input: UpdateUserRecord,
    ) -> AppResult<Option<UserRecord>> {
        let row = sqlx::query(
        r#"
            UPDATE users SET
                username = COALESCE($1, username),
                first_name = COALESCE($2, first_name),
                last_name = COALESCE($3, last_name),
                avatar_url = COALESCE($4, avatar_url),
                bio = COALESCE($5, bio),
                date_of_birth = COALESCE($6, date_of_birth),
                gender = COALESCE($7, gender),
                phone = COALESCE($8, phone),
                secondary_email = COALESCE($9, secondary_email),
                website_url = COALESCE($10, website_url),
                github_url = COALESCE($11, github_url),
                twitter_url = COALESCE($12, twitter_url),
                linkedin_url = COALESCE($13, linkedin_url),
                facebook_url = COALESCE($14, facebook_url),
                instagram_url = COALESCE($15, instagram_url),
                youtube_url = COALESCE($16, youtube_url),
                address_line1 = COALESCE($17, address_line1),
                address_line2 = COALESCE($18, address_line2),
                city = COALESCE($19, city),
                state = COALESCE($20, state),
                postal_code = COALESCE($21, postal_code),
                country = COALESCE($22, country),
                locale = COALESCE($23, locale),
                timezone = COALESCE($24, timezone),
                marketing_opt_in = COALESCE($25, marketing_opt_in),
                is_active = COALESCE($26, is_active)
            WHERE id = $27
            RETURNING id, username, email, password_hash, role, first_name, last_name, full_name, avatar_url, is_active, is_blocked, created_at
            "#,
        )
        .bind(input.username)
        .bind(input.first_name)
        .bind(input.last_name)
        .bind(input.avatar_url)
        .bind(input.bio)
        .bind(input.date_of_birth)
        .bind(input.gender)
        .bind(input.phone)
        .bind(input.secondary_email)
        .bind(input.website_url)
        .bind(input.github_url)
        .bind(input.twitter_url)
        .bind(input.linkedin_url)
        .bind(input.facebook_url)
        .bind(input.instagram_url)
        .bind(input.youtube_url)
        .bind(input.address_line1)
        .bind(input.address_line2)
        .bind(input.city)
        .bind(input.state)
        .bind(input.postal_code)
        .bind(input.country)
        .bind(input.locale)
        .bind(input.timezone)
        .bind(input.marketing_opt_in)
        .bind(input.is_active)
        .bind(id)
        .fetch_optional(&self.pool)
        .await
        .map_err(AppError::from)?;

        Ok(row.map(map_user_row))
    }

    async fn delete_by_id(&self, id: uuid::Uuid) -> AppResult<()> {
        sqlx::query(r#"DELETE FROM users WHERE id = $1"#)
            .bind(id)
            .execute(&self.pool)
            .await
            .map_err(AppError::from)?;
        Ok(())
    }
}

fn map_user_row(row: sqlx::postgres::PgRow) -> UserRecord {
    UserRecord {
        id: row.get("id"),
        username: row.get("username"),
        email: row.get("email"),
        password_hash: row.try_get("password_hash").ok(),
        role: row.get("role"),
        first_name: row.get("first_name"),
        last_name: row.get("last_name"),
        full_name: row.get("full_name"),
        avatar_url: row.get("avatar_url"),
        is_active: row.get("is_active"),
        is_blocked: row.get("is_blocked"),
        created_at: row.get("created_at"),
    }
}
