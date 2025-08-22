use execute_academy::repositories::postgresql::users::PostgresUsersRepository;
use execute_academy::repositories::users::{CreateUserRecord, UsersRepository, UpdateUserRecord};

mod common;
use common::db::test_pool;

#[tokio::test]
async fn create_find_update_user_happy_path() {
    let pool = test_pool().await;
    let repo = PostgresUsersRepository { pool };

    let email = format!("user{}@example.com", uuid::Uuid::new_v4());
    let username = format!("user_{}", uuid::Uuid::new_v4());

    // Create
    let user_id = repo
        .create(CreateUserRecord {
            username: username.clone(),
            email: email.clone(),
            password_hash: "plain:secret".to_string(),
            role: "user".to_string(),
        })
        .await
        .expect("create user");

    // Find by email
    let found = repo
        .find_by_email(&email)
        .await
        .expect("find by email")
        .expect("some");
    assert_eq!(found.id, user_id);
    assert_eq!(found.username, username);

    // Find by id
    let found_by_id = repo
        .find_by_id(user_id)
        .await
        .expect("find by id")
        .expect("some");
    assert_eq!(found_by_id.email, email);

    // Update partial
    let updated = repo
        .update_partial(
            user_id,
            UpdateUserRecord {
                first_name: Some("Ada".into()),
                last_name: Some("Lovelace".into()),
                ..Default::default()
            },
        )
        .await
        .expect("update")
        .expect("updated row");

    assert_eq!(updated.first_name.as_deref(), Some("Ada"));
    assert_eq!(updated.last_name.as_deref(), Some("Lovelace"));
}


