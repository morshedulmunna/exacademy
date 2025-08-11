use anyhow::{Context, Result};
use async_trait::async_trait;
use chrono::Utc;
use mongodb::bson::DateTime as MongoDateTime;
use mongodb::bson::{doc, oid::ObjectId};
use mongodb::{Collection, Database};

use crate::application::services::{SessionRepository, UserRepository};
use crate::domain::sessions::Session;
use crate::domain::users::{User, UserRole};

/// Accounts repository: link OAuth provider accounts to users
pub struct MongoAccountsRepository {
    db: Database,
    coll: Collection<mongodb::bson::Document>,
}

impl MongoAccountsRepository {
    pub fn new(db: &Database) -> Self {
        Self {
            db: db.clone(),
            coll: db.collection("accounts"),
        }
    }

    pub async fn find_user_by_provider_account(
        &self,
        provider: &str,
        provider_account_id: &str,
    ) -> Result<Option<User>> {
        // Find account, then fetch user
        if let Some(account) = self
            .coll
            .find_one(doc! {"provider": provider, "providerAccountId": provider_account_id})
            .await
            .context("query account failed")?
        {
            if let Ok(user_id) = account.get_object_id("userId") {
                let users_coll = self.db.collection::<mongodb::bson::Document>("users");
                if let Some(user_doc) = users_coll
                    .find_one(doc! {"_id": user_id})
                    .await
                    .context("query user by account failed")?
                {
                    return Ok(Some(MongoUserRepository::map_doc_to_user(user_doc)?));
                }
            }
        }
        Ok(None)
    }

    pub async fn link_account_to_user(
        &self,
        user_id: &str,
        provider: &str,
        provider_account_id: &str,
        access_token: Option<&str>,
        refresh_token: Option<&str>,
        expires_at: Option<i64>,
    ) -> Result<()> {
        let user_oid = ObjectId::parse_str(user_id).context("invalid user id")?;
        let mut doc_insert = doc! {
            "userId": user_oid,
            "type": "oauth",
            "provider": provider,
            "providerAccountId": provider_account_id,
        };
        if let Some(at) = access_token {
            doc_insert.insert("access_token", at);
        }
        if let Some(rt) = refresh_token {
            doc_insert.insert("refresh_token", rt);
        }
        if let Some(exp) = expires_at {
            doc_insert.insert("expires_at", exp);
        }

        self.coll
            .insert_one(doc_insert)
            .await
            .context("link account insert failed")?;
        Ok(())
    }
}

/// Mongo-backed implementation of UserRepository
pub struct MongoUserRepository {
    coll: Collection<mongodb::bson::Document>,
}

impl MongoUserRepository {
    pub fn new(db: &Database) -> Self {
        Self {
            coll: db.collection("users"),
        }
    }

    pub(crate) fn map_doc_to_user(doc: mongodb::bson::Document) -> Result<User> {
        let id = doc.get_object_id("_id")?.to_hex();
        let email = doc.get_str("email")?.to_string();
        let name = doc.get_str("name")?.to_string();
        let username = doc.get_str("username")?.to_string();
        let password_hash = doc.get_str("password")?.to_string();
        let role_str = doc.get_str("role")?.to_string();
        let role = match role_str.as_str() {
            "ADMIN" => UserRole::ADMIN,
            _ => UserRole::USER,
        };
        let bio = doc.get_str("bio").ok().map(|s| s.to_string());
        let avatar = doc.get_str("avatar").ok().map(|s| s.to_string());
        let website = doc.get_str("website").ok().map(|s| s.to_string());
        let location = doc.get_str("location").ok().map(|s| s.to_string());
        let created_at = Utc::now();
        let updated_at = Utc::now();

        Ok(User {
            id,
            email,
            name,
            username,
            password_hash,
            role,
            bio,
            avatar,
            website,
            location,
            created_at,
            updated_at,
        })
    }
}

#[async_trait]
impl UserRepository for MongoUserRepository {
    async fn find_by_email(&self, email: &str) -> Result<Option<User>> {
        let doc_opt = self
            .coll
            .find_one(doc! {"email": email})
            .await
            .context("query user by email failed")?;
        Ok(doc_opt.map(Self::map_doc_to_user).transpose()?)
    }

    async fn find_by_id(&self, id: &str) -> Result<Option<User>> {
        let object_id = ObjectId::parse_str(id).context("invalid user id")?;
        let doc_opt = self
            .coll
            .find_one(doc! {"_id": object_id})
            .await
            .context("query user by id failed")?;
        Ok(doc_opt.map(Self::map_doc_to_user).transpose()?)
    }
}

/// Mongo-backed implementation of SessionRepository
pub struct MongoSessionRepository {
    coll: Collection<mongodb::bson::Document>,
}

impl MongoSessionRepository {
    pub fn new(db: &Database) -> Self {
        Self {
            coll: db.collection("sessions"),
        }
    }
}

#[async_trait]
impl SessionRepository for MongoSessionRepository {
    async fn create(&self, session: &Session) -> Result<Session> {
        let user_oid = ObjectId::parse_str(&session.user_id).context("invalid user id")?;
        let doc = doc! {
            "sessionToken": &session.session_token,
            "userId": user_oid,
            "expires": MongoDateTime::from_millis(session.expires.timestamp_millis()),
        };
        self.coll
            .insert_one(doc)
            .await
            .context("insert session failed")?;
        Ok(session.clone())
    }

    async fn find_by_token(&self, token: &str) -> Result<Option<Session>> {
        let doc_opt = self
            .coll
            .find_one(doc! {"sessionToken": token})
            .await
            .context("query session by token failed")?;
        let session = doc_opt.map(|doc| {
            let token = doc.get_str("sessionToken").unwrap_or("").to_string();
            let user_id = doc
                .get_object_id("userId")
                .map(|o| o.to_hex())
                .unwrap_or_default();
            let expires = doc
                .get_datetime("expires")
                .ok()
                .and_then(|dt| {
                    chrono::DateTime::<Utc>::from_timestamp_millis(dt.timestamp_millis())
                })
                .unwrap_or_else(|| Utc::now());
            Session {
                id: None,
                session_token: token,
                user_id,
                expires,
            }
        });
        Ok(session)
    }

    async fn delete_by_token(&self, token: &str) -> Result<()> {
        self.coll
            .delete_one(doc! {"sessionToken": token})
            .await
            .context("delete session failed")?;
        Ok(())
    }
}
