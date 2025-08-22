use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};

/// Create a Postgres connection pool for tests and ensure migrations are applied.
///
/// The function reads `DATABASE_URL` from the environment or falls back to a sane
/// local default suitable for docker-compose/dev setups.
pub async fn test_pool() -> Pool<Postgres> {
    let _ = dotenv::dotenv().ok();
    let url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        "postgres://execute_academy:password@localhost:5432/execute_academy?sslmode=disable"
            .to_string()
    });

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&url)
        .await
        .expect("connect to postgres for tests");

    // Run migrations once per test process start; idempotent across runs.
    run_migrations(&pool).await;

    pool
}

/// Apply all SQLx migrations under `migrations/` directory. Panics on failure to
/// surface environment issues early (e.g., missing extensions or privileges).
pub async fn run_migrations(pool: &Pool<Postgres>) {
    sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("apply database migrations");
}
