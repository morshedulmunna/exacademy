use std::sync::Arc;

use execute_academy::applications::users;
use execute_academy::configs::app_context::AppContext;
use execute_academy::pkg::email::EmailSender;
use execute_academy::pkg::security_services::{JwtService, PasswordHasher};
use execute_academy::repositories::postgresql::users::PostgresUsersRepository;
use execute_academy::repositories::users::{CreateUserRecord, UsersRepository};
use execute_academy::types::user_types::UpdateUserRequest;

mod common;
use common::db::test_pool;
use common::redis::test_redis_manager;
use common::fakes::{InMemoryMailer, PlaintextHasher, DeterministicJwt};

struct TestMailer(InMemoryMailer);

#[async_trait::async_trait]
impl EmailSender for TestMailer {
    async fn send_email(&self, msg: &execute_academy::pkg::email::EmailMessage) -> anyhow::Result<()> {
        self.0.send_email(msg).await
    }
}

async fn test_context() -> Arc<AppContext> {
    let _ = dotenv::dotenv().ok();
    let pool = test_pool().await;
    let redis = test_redis_manager();

    let system = execute_academy::configs::system_config::SystemConfig::load_from_env().unwrap();
    let auth_cfg = execute_academy::configs::auth_config::AuthConfig::load_from_env().unwrap();
    let redis_cfg = execute_academy::configs::redis_config::RedisConfig::load_from_env().unwrap();
    let kafka = execute_academy::configs::kafka_config::KafkaConfig::load_from_env().unwrap();

    let repos = execute_academy::repositories::Repositories::new(pool.clone());

    let password_hasher: Arc<dyn PasswordHasher> = Arc::new(PlaintextHasher);
    let jwt_service: Arc<dyn JwtService> = Arc::new(DeterministicJwt);
    let email_producer: Arc<dyn EmailSender> = Arc::new(TestMailer(InMemoryMailer::new()));

    Arc::new(AppContext {
        system,
        db_pool: pool,
        redis_config: redis_cfg,
        redis,
        auth: auth_cfg,
        repos,
        password_hasher,
        jwt_service,
        kafka,
        email_producer,
    })
}

#[tokio::test]
async fn get_and_update_user_profile_with_cache() {
    let ctx = test_context().await;

    // Seed a user directly via repo
    let repo = PostgresUsersRepository { pool: ctx.db_pool.clone() };
    let email = format!("user{}@example.com", uuid::Uuid::new_v4());
    let username = format!("user_{}", uuid::Uuid::new_v4());
    let user_id = repo
        .create(CreateUserRecord {
            username: username.clone(),
            email: email.clone(),
            password_hash: "plain:secret".into(),
            role: "user".into(),
        })
        .await
        .unwrap();

    // First fetch, not in cache
    let profile = users::get_user_by_id(&ctx, &repo, user_id).await.unwrap();
    assert_eq!(profile.email, email);

    // Second fetch, should hit cache; behavior is transparent but ensures serde works
    let profile2 = users::get_user_by_id(&ctx, &repo, user_id).await.unwrap();
    assert_eq!(profile2.username, username);

    // Update fields and ensure cache is refreshed
    let updated = users::update_user_by_id(
        &ctx,
        &repo,
        user_id,
        UpdateUserRequest {
            username: Some("new_name".into()),
            first_name: Some("First".into()),
            last_name: Some("Last".into()),
            avatar_url: None,
            bio: None,
            date_of_birth: None,
            gender: None,
            phone: None,
            secondary_email: None,
            website_url: None,
            github_url: None,
            twitter_url: None,
            linkedin_url: None,
            facebook_url: None,
            instagram_url: None,
            youtube_url: None,
            address_line1: None,
            address_line2: None,
            city: None,
            state: None,
            postal_code: None,
            country: None,
            locale: None,
            timezone: None,
            marketing_opt_in: None,
        },
    )
    .await
    .unwrap();

    assert_eq!(updated.username, "new_name");

    // Fetch again should reflect updated cache
    let profile3 = users::get_user_by_id(&ctx, &repo, user_id).await.unwrap();
    assert_eq!(profile3.username, "new_name");
}


