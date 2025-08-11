# Authentication & Authorization Guide

This guide covers session-based auth and social (OAuth) login (Google, GitHub, Facebook-ready) built following a Domain-Driven Design (DDD) approach.

## Architecture (DDD)

- Domain: `users`, `sessions` aggregates.
- Application: `AuthService` (sessions), `SocialAuthService` (OAuth).
- Infrastructure: Mongo repositories for `users`, `sessions`, `accounts`.
- Interface/HTTP: middlewares (`session_auth`, `auth_extractor`) and routes (`auth`, `oauth`).

## Collections

- `users`: unique `email`, unique `username`.
- `sessions`: unique `sessionToken`, fields: `sessionToken`, `userId`, `expires`.
- `accounts`: links OAuth provider accounts to users with `{provider, providerAccountId}` unique.

## Configuration

Environment variables (examples):

```
JWT_SECRET=replace-with-random
MONGODB_URI=mongodb://localhost:27017/execute_academy
MONGODB_DATABASE=execute_academy
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_SSL=false

OAUTH_GOOGLE_CLIENT_ID=...
OAUTH_GOOGLE_CLIENT_SECRET=...
OAUTH_GOOGLE_REDIRECT_URI=http://localhost:8080/oauth/google/callback

OAUTH_GITHUB_CLIENT_ID=...
OAUTH_GITHUB_CLIENT_SECRET=...
OAUTH_GITHUB_REDIRECT_URI=http://localhost:8080/oauth/github/callback

OAUTH_FACEBOOK_CLIENT_ID=...
OAUTH_FACEBOOK_CLIENT_SECRET=...
OAUTH_FACEBOOK_REDIRECT_URI=http://localhost:8080/oauth/facebook/callback
```

## Local Auth (Email/Password)

Routes are defined in `api/src/interface/http/routes/auth.rs` and configured in `routes/mod.rs` under scope `/auth`.

- POST `/auth/register`

  - Body:
    ```json
    { "email": "john@example.com", "name": "John", "username": "john", "password": "secret" }
    ```
  - Response: 201 with `{ message: "registered" }`.

- POST `/auth/login`

  - Body:
    ```json
    { "email": "john@example.com", "password": "secret" }
    ```
  - Response: 200 with
    ```json
    {
      "message": "logged in",
      "data": {
        "sessionToken": "<token>",
        "expires": "2025-01-01T00:00:00Z"
      }
    }
    ```
  - Client should store `sessionToken` and send it in `Authorization: Bearer <token>` header (or cookie named `session`).

- POST `/auth/logout`

  - Requires session (via header or cookie). Invalidates session.

- GET `/auth/me`
  - Requires session.
  - Returns the current user. Uses `CurrentUser` extractor.

### Session transport

- Preferred: `Authorization: Bearer <sessionToken>` header.
- Alternative: cookie named `session`.
- You can update `login` and OAuth `callback` to set `HttpOnly; Secure` cookie, if desired (not enabled by default).

## Social (OAuth) Login

Routes are defined in `api/src/interface/http/routes/social.rs` and configured in `routes/mod.rs` under scope `/oauth`.

- GET `/oauth/{provider}/start?state=<optional>`

  - Supported `provider`: `google`, `github`, `facebook` (scaffolded).
  - Redirects to provider auth page. Example:
    ```bash
    curl -i "http://localhost:8080/oauth/google/start"
    ```

- GET `/oauth/{provider}/callback?code=...&state=...`
  - Handles provider callback. Exchanges code for access token, fetches user profile, links or creates `user`, creates a session.
  - Response: 200 with `{ sessionToken }`.

### Provider specifics

- Google
  - Auth URL: `https://accounts.google.com/o/oauth2/v2/auth`
  - Token URL: `https://oauth2.googleapis.com/token`
  - Userinfo: `https://www.googleapis.com/oauth2/v3/userinfo`
  - Scopes: `openid email profile`
- GitHub
  - Auth URL: `https://github.com/login/oauth/authorize`
  - Token URL: `https://github.com/login/oauth/access_token`
  - Userinfo: `https://api.github.com/user`
  - Notes: GitHub may omit email in the base `/user` response; production apps often call `/user/emails` to resolve primary/verified email.
- Facebook
  - URLs present; userinfo fetch is left as a placeholder to be tailored to granted app permissions and chosen fields.

### Account linking

- If a provider account is already linked, we sign in and create a session.
- If not:
  - We upsert a `user` (by email if available, else create minimal record),
  - Link the provider account in `accounts` collection,
  - Create a session.

## Middleware & Extractor

- `session_auth.rs`: Resolves `sessionToken` from header/cookie and, if valid, attaches `User` to `req.extensions_mut()`.
- `auth_extractor.rs`: `CurrentUser(User)` to force authentication in handlers.

Example usage in a handler:

```rust
use crate::interface::http::middlewares::auth_extractor::CurrentUser;
use crate::pkg::error::{AppError, AppResult};
use actix_web::HttpResponse;

pub async fn admin_only(CurrentUser(user): CurrentUser) -> AppResult<HttpResponse> {
    if !user.is_admin() {
        return Err(AppError::Forbidden("Admin only".into()));
    }
    Ok(HttpResponse::Ok().finish())
}
```

## Error Handling & Responses

- All handlers return `Result<T, AppError>` which maps to standardized JSON via `ApiErrorResponse`.
- Common errors: `Unauthorized`, `Forbidden`, `BadRequest`, `Conflict`, `Validation`, `Internal`.
- Middlewares:
  - `error_handler.rs` converts unhandled errors into `AppError` and logs details.
  - `rate_limit.rs` returns 429 with standard headers and structured body.
  - `request_logger.rs` logs structured request metrics.

## Security Notes

- Passwords hashed with Argon2id.
- Prefer `Authorization: Bearer` header or `HttpOnly; Secure` cookies for sessions.
- Rate limiting enabled globally.
- Ensure strong random `JWT_SECRET` even if JWT isn’t used now (reserved for future).
- Consider short session TTL and refresh/rotation strategies for production.

## Quick Test with curl

```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","name":"John","username":"john","password":"secret"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","password":"secret"}' | jq -r '.data.sessionToken')

# Me
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/auth/me

# OAuth (start)
open "http://localhost:8080/oauth/google/start"
```

## File References

- Session middleware: `api/src/interface/http/middlewares/session_auth.rs`
- Extractor: `api/src/interface/http/middlewares/auth_extractor.rs`
- Local auth routes: `api/src/interface/http/routes/auth.rs`
- OAuth routes: `api/src/interface/http/routes/social.rs`
- Auth service: `api/src/application/services.rs`
- Social auth service: `api/src/application/social.rs`
- Mongo repositories: `api/src/infrastructure/repositories.rs`
- Configs: `api/src/configs/{configs.rs,load.rs}`
- Security helpers: `api/src/pkg/security.rs`
