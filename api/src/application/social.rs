use anyhow::{Context, Result};
use oauth2::{AuthorizationCode, ClientId, ClientSecret, CsrfToken, Scope, TokenResponse};
use oauth2::basic::BasicClient;
use oauth2::reqwest::async_http_client;
use oauth2::{AuthUrl, RedirectUrl, TokenUrl};

use crate::configs::{OAuthProviders, ProviderConfig};
use crate::infrastructure::repositories::MongoAccountsRepository;
use crate::application::services::{AuthService, UserRepository, SessionRepository};
use crate::domain::users::{User, UserRole};
use mongodb::bson::doc;
use mongodb::Database;

/// Social auth service to handle provider flows.
pub struct SocialAuthService<U: UserRepository, S: SessionRepository> {
    pub auth: AuthService<U, S>,
    pub accounts: MongoAccountsRepository,
    pub oauth: OAuthProviders,
    pub db: Database,
}

impl<U: UserRepository, S: SessionRepository> SocialAuthService<U, S> {
    pub fn new(auth: AuthService<U, S>, accounts: MongoAccountsRepository, oauth: OAuthProviders, db: Database) -> Self {
        Self { auth, accounts, oauth, db }
    }

    fn build_client(provider: &ProviderConfig, auth_url: &str, token_url: &str) -> Result<BasicClient> {
        Ok(BasicClient::new(
            ClientId::new(provider.client_id.clone()),
            Some(ClientSecret::new(provider.client_secret.clone())),
            AuthUrl::new(auth_url.to_string())?,
            Some(TokenUrl::new(token_url.to_string())?),
        ).set_redirect_uri(RedirectUrl::new(provider.redirect_uri.clone())?))
    }

    pub fn authorize_url(&self, provider: &str, state: String) -> Result<String> {
        let (client, scope) = match provider {
            "google" => {
                let cfg = self.oauth.google.as_ref().context("google provider not configured")?;
                (Self::build_client(cfg, "https://accounts.google.com/o/oauth2/v2/auth", "https://oauth2.googleapis.com/token")?,
                 Some("openid email profile".to_string()))
            }
            "github" => {
                let cfg = self.oauth.github.as_ref().context("github provider not configured")?;
                (Self::build_client(cfg, "https://github.com/login/oauth/authorize", "https://github.com/login/oauth/access_token")?, None)
            }
            "facebook" => {
                let cfg = self.oauth.facebook.as_ref().context("facebook provider not configured")?;
                (Self::build_client(cfg, "https://www.facebook.com/v12.0/dialog/oauth", "https://graph.facebook.com/v12.0/oauth/access_token")?, None)
            }
            _ => return Err(anyhow::anyhow!("Unsupported provider")),
        };

        let mut auth_req = client.authorize_url(|| CsrfToken::new(state));
        if let Some(scope) = scope {
            for s in scope.split(' ') { auth_req = auth_req.add_scope(Scope::new(s.to_string())); }
        }
        let (url, _csrf) = auth_req.url();
        Ok(url.to_string())
    }

    pub async fn handle_callback(&self, provider: &str, code: &str) -> Result<(User, String)> {
        // exchange code for token
        let (client, userinfo_url) = match provider {
            "google" => {
                let cfg = self.oauth.google.as_ref().context("google provider not configured")?;
                (Self::build_client(cfg, "https://accounts.google.com/o/oauth2/v2/auth", "https://oauth2.googleapis.com/token")?,
                 Some("https://www.googleapis.com/oauth2/v3/userinfo".to_string()))
            }
            "github" => {
                let cfg = self.oauth.github.as_ref().context("github provider not configured")?;
                (Self::build_client(cfg, "https://github.com/login/oauth/authorize", "https://github.com/login/oauth/access_token")?,
                 Some("https://api.github.com/user".to_string()))
            }
            "facebook" => {
                let cfg = self.oauth.facebook.as_ref().context("facebook provider not configured")?;
                (Self::build_client(cfg, "https://www.facebook.com/v12.0/dialog/oauth", "https://graph.facebook.com/v12.0/oauth/access_token")?, None)
            }
            _ => return Err(anyhow::anyhow!("Unsupported provider")),
        };

        let token = client
            .exchange_code(AuthorizationCode::new(code.to_string()))
            .request_async(async_http_client)
            .await?;

        // try find user by provider account
        let (provider_account_id, email, name) = fetch_user_info(provider, userinfo_url, token.access_token().secret()).await?;
        if let Some(user) = self
            .accounts
            .find_user_by_provider_account(provider, &provider_account_id)
            .await? {
            let session = self.auth.create_session(&user.id).await?;
            return Ok((user, session.session_token));
        }

        // If no link, create or upsert user by email, then link account
        let users_coll = self.db.collection::<mongodb::bson::Document>("users");
        let existing = users_coll.find_one(doc!{"email": &email}).await?;
        let user = if let Some(doc) = existing {
            super::super::infrastructure::repositories::MongoUserRepository::map_doc_to_user(doc)?
        } else {
            let now = chrono::Utc::now();
            let username = email.split('@').next().unwrap_or("user").to_string();
            let doc = doc!{
                "email": &email,
                "name": name.clone().unwrap_or_else(|| username.clone()),
                "username": username,
                "password": "", // social users don't have local password by default
                "role": "USER",
                "createdAt": mongodb::bson::DateTime::from_millis(now.timestamp_millis()),
                "updatedAt": mongodb::bson::DateTime::from_millis(now.timestamp_millis()),
            };
            let ins = users_coll.insert_one(doc).await?;
            let oid = ins.inserted_id.as_object_id().context("missing inserted id")?;
            let u = User {
                id: oid.to_hex(),
                email: email.clone(),
                name: name.clone().unwrap_or_default(),
                username: String::new(),
                password_hash: String::new(),
                role: UserRole::USER,
                bio: None,
                avatar: None,
                website: None,
                location: None,
                created_at: chrono::Utc::now(),
                updated_at: chrono::Utc::now(),
            };
            u
        };

        self.accounts
            .link_account_to_user(&user.id, provider, &provider_account_id, None, None, None)
            .await?;
        let session = self.auth.create_session(&user.id).await?;
        Ok((user, session.session_token))
    }
}

async fn fetch_user_info(
    provider: &str,
    userinfo_url: Option<String>,
    access_token: &str,
) -> Result<(String, String, Option<String>)> {
    let client = reqwest::Client::new();
    match provider {
        "google" => {
            let url = userinfo_url.context("missing userinfo url")?;
            let resp = client.get(url)
                .bearer_auth(access_token)
                .send().await?
                .json::<serde_json::Value>().await?;
            let sub = resp.get("sub").and_then(|v| v.as_str()).context("no sub")?.to_string();
            let email = resp.get("email").and_then(|v| v.as_str()).context("no email")?.to_string();
            let name = resp.get("name").and_then(|v| v.as_str()).map(|s| s.to_string());
            Ok((sub, email, name))
        }
        "github" => {
            let url = userinfo_url.context("missing userinfo url")?;
            let resp = client.get(url)
                .header("User-Agent", "execute-academy")
                .bearer_auth(access_token)
                .send().await?
                .json::<serde_json::Value>().await?;
            let id = resp.get("id").and_then(|v| v.as_i64()).context("no id")?.to_string();
            let email = resp.get("email").and_then(|v| v.as_str()).unwrap_or("").to_string();
            let name = resp.get("name").and_then(|v| v.as_str()).map(|s| s.to_string());
            Ok((id, email, name))
        }
        "facebook" => {
            // For Facebook, normally need to call graph with fields
            // This is a placeholder since specifics vary per app perms
            Ok(("fb_user".to_string(), "".to_string(), None))
        }
        _ => Err(anyhow::anyhow!("Unsupported provider")),
    }
}


