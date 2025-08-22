use std::sync::Arc;

use execute_academy::applications::auth;
use execute_academy::configs::app_context::AppContext;
use execute_academy::pkg::email::EmailSender;
use execute_academy::pkg::security_services::{JwtService, PasswordHasher};
use execute_academy::repositories::users::UsersRepository;
use execute_academy::types::user_types::{LoginRequest, RefreshRequest, RegisterRequest, ResendOtpRequest, VerifyOtpRequest};

mod common;
use common::db::test_pool;
use common::redis::test_redis_manager;
use common::fakes::{InMemoryMailer, PlaintextHasher, DeterministicJwt};
use execute_academy::pkg::redis::RedisOps;

struct TestMailer(InMemoryMailer);

#[async_trait::async_trait]
impl EmailSender for TestMailer {
    async fn send_email(&self, msg: &execute_academy::pkg::email::EmailMessage) -> anyhow::Result<()> {
        self.0.send_email(msg).await
    }
}

async fn test_context(mailer: InMemoryMailer) -> Arc<AppContext> {
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
    let email_producer: Arc<dyn EmailSender> = Arc::new(TestMailer(mailer.clone()));

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
async fn register_login_refresh_and_verify_flow() {
    let mailer = InMemoryMailer::new();
    let ctx = test_context(mailer.clone()).await;
    let repo = ctx.repos.users.clone();
    let repo: &dyn UsersRepository = &*repo;

    // Register
    let email = format!("{}@example.com", uuid::Uuid::new_v4());
    let username = format!("user_{}", uuid::Uuid::new_v4());
    let register = RegisterRequest {
        first_name: "Ada".into(),
        last_name: "Lovelace".into(),
        username: username.clone(),
        email: email.clone(),
        password: "secret".into(),
    };
    let reg = auth::register(&ctx, repo, register).await.expect("register");
    let user = repo.find_by_id(reg.id).await.unwrap().unwrap();
    assert_eq!(user.email, email);

    // Resend OTP
    auth::resend_otp(&ctx, repo, ResendOtpRequest { email: email.clone() })
        .await
        .expect("resend otp");

    // OTP must be in Redis, but we do not know it. Simulate by reading from Redis key directly
    let key = format!("otp:verify:{}", email.to_lowercase());
    let code: Option<String> = ctx.redis.get(&key).await.unwrap();
    let code = code.expect("otp code present");

    // Verify OTP
    auth::verify_otp(&ctx, repo, VerifyOtpRequest { email: email.clone(), code: code.clone() })
        .await
        .expect("verify");

    // Now login should succeed
    let login = auth::login(&ctx, repo, LoginRequest { email: email.clone(), password: "secret".into() }).await.expect("login");
    assert_eq!(login.user.email, email);

    // Refresh
    let refreshed = auth::refresh(&ctx, RefreshRequest { refresh_token: login.refresh_token.clone() }).await.expect("refresh");
    assert!(!refreshed.access_token.is_empty());
}


