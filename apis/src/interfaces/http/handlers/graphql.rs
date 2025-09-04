use axum::{Router, response::Html, routing::get};

/// GraphQL playground handler
pub async fn graphql_playground() -> Html<String> {
    Html(async_graphql::http::playground_source(
        async_graphql::http::GraphQLPlaygroundConfig::new("/graphql"),
    ))
}

/// Placeholder GraphQL handler
pub async fn graphql_info() -> Html<&'static str> {
    Html(
        r#"
    <h1>GraphQL Authentication Implementation</h1>
    <p>GraphQL auth has been implemented with the following structure:</p>
    <ul>
        <li><strong>Types:</strong> Input/Output types for auth operations (login, register, etc.)</li>
        <li><strong>Resolvers:</strong> Auth mutations and queries with validation</li>
        <li><strong>Context:</strong> GraphQL context with authentication middleware</li>
        <li><strong>Schema:</strong> Complete GraphQL schema for auth operations</li>
    </ul>
    <p>Available auth operations:</p>
    <ul>
        <li>register - Register new user</li>
        <li>login - Login with email/password</li>
        <li>refresh - Refresh access token</li>
        <li>googleLogin - Login with Google OAuth</li>
        <li>githubLogin - Login with GitHub OAuth</li>
        <li>verifyOtp - Verify email OTP</li>
        <li>resendOtp - Resend email OTP</li>
        <li>forgotPassword - Request password reset</li>
        <li>resetPassword - Reset password with OTP</li>
        <li>logout - Logout user</li>
        <li>me - Get current user info</li>
    </ul>
    <p><a href="/graphql/playground">Visit GraphQL Playground</a></p>
    "#,
    )
}

/// Create GraphQL routes
pub fn router() -> Router {
    Router::new()
        .route("/graphql", get(graphql_info))
        .route("/graphql/playground", get(graphql_playground))
}
