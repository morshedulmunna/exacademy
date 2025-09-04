use std::sync::Arc;

use async_graphql::{Context, Error, Result};
use async_graphql_axum::GraphQLRequest;

use crate::configs::app_context::AppContext;
use crate::pkg::auth::AuthUser;

/// GraphQL context that provides access to application state and authentication
#[derive(Clone)]
pub struct GraphQLContext {
    pub app_context: Arc<AppContext>,
    pub auth_user: Option<AuthUser>,
}

impl GraphQLContext {
    /// Create a new GraphQL context
    pub fn new(app_context: Arc<AppContext>, auth_user: Option<AuthUser>) -> Self {
        Self {
            app_context,
            auth_user,
        }
    }

    /// Get the authenticated user, returning an error if not authenticated
    pub fn require_auth(&self) -> Result<&AuthUser> {
        self.auth_user
            .as_ref()
            .ok_or_else(|| Error::new("Authentication required"))
    }

    /// Get the authenticated user if available
    pub fn get_auth_user(&self) -> Option<&AuthUser> {
        self.auth_user.as_ref()
    }

    /// Check if the current user has a specific role
    pub fn has_role(&self, role: &str) -> bool {
        self.auth_user
            .as_ref()
            .map(|user| user.role == role)
            .unwrap_or(false)
    }

    /// Check if the current user is an admin
    pub fn is_admin(&self) -> bool {
        self.has_role("admin")
    }

    /// Require admin role, returning an error if not admin
    pub fn require_admin(&self) -> Result<&AuthUser> {
        let user = self.require_auth()?;
        if user.role == "admin" {
            Ok(user)
        } else {
            Err(Error::new("Admin access required"))
        }
    }
}

/// Extension trait to easily access GraphQL context
pub trait GraphQLContextExt {
    fn ctx(&self) -> &GraphQLContext;
}

impl GraphQLContextExt for Context<'_> {
    fn ctx(&self) -> &GraphQLContext {
        self.data_unchecked::<GraphQLContext>()
    }
}

/// Extract authentication from GraphQL request headers
pub async fn extract_auth_from_request(
    _app_context: &Arc<AppContext>,
    _request: &GraphQLRequest,
) -> Option<AuthUser> {
    // For now, we'll handle auth extraction in the handler
    // This function will be called from the GraphQL handler with proper context
    None
}

/// Validate JWT token and return AuthUser if valid
#[allow(dead_code)]
async fn validate_token(app_context: &Arc<AppContext>, token: &str) -> Option<AuthUser> {
    use crate::pkg::security::Claims;
    use jsonwebtoken::{DecodingKey, Validation, decode};
    use uuid::Uuid;

    let validation = Validation::default();
    let key = DecodingKey::from_secret(app_context.auth.jwt_secret.as_bytes());

    match decode::<Claims>(token, &key, &validation) {
        Ok(token_data) => {
            let claims = token_data.claims;
            // Convert string to UUID
            if let Ok(user_id) = Uuid::parse_str(&claims.sub) {
                Some(AuthUser {
                    user_id,
                    role: claims.role,
                })
            } else {
                None
            }
        }
        Err(_) => None,
    }
}
