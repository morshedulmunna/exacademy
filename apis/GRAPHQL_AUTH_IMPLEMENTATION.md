# GraphQL Authentication Implementation

## Overview

A complete GraphQL authentication system has been implemented with a good folder structure that mirrors the REST API organization. This implementation provides all the necessary components for GraphQL authentication but requires final integration with the HTTP server.

## Project Structure

```
apis/src/interfaces/graphql/
├── mod.rs                      # Main GraphQL module
├── context.rs                  # GraphQL context with auth middleware
├── schema.rs                   # GraphQL schema creation
└── auth/
    ├── mod.rs                  # Auth module exports
    ├── inputs.rs               # GraphQL input types
    ├── outputs.rs              # GraphQL output types
    └── resolvers.rs            # Auth resolvers (mutations & queries)
```

## Implemented Features

### Authentication Mutations

- `register` - Register new user account
- `login` - Login with email and password
- `refresh` - Refresh access token using refresh token
- `googleLogin` - Login with Google OAuth ID token
- `githubLogin` - Login with GitHub OAuth code
- `verifyOtp` - Verify email with OTP code
- `resendOtp` - Resend email verification OTP
- `forgotPassword` - Request password reset
- `resetPassword` - Reset password with OTP code
- `logout` - Logout user (client-side token removal)

### Authentication Queries

- `me` - Get current authenticated user information

### GraphQL Types

#### Input Types

- `RegisterInput` - User registration data
- `LoginInput` - User login credentials
- `RefreshInput` - Token refresh data
- `GoogleLoginInput` - Google OAuth token
- `GithubLoginInput` - GitHub OAuth code
- `VerifyOtpInput` - Email verification data
- `ResendOtpInput` - Resend OTP request
- `ForgotPasswordInput` - Password reset request
- `ResetPasswordInput` - Password reset with code

#### Output Types

- `User` - User information
- `LoginResponse` - Login result with tokens
- `RegisterResponse` - Registration result
- `TokenResponse` - Token refresh result
- `SuccessResponse` - Generic success response

## Authentication Context

The GraphQL context (`GraphQLContext`) provides:

- Access to application context (`AppContext`)
- Authentication user information (`AuthUser`)
- Helper methods for auth checks:
  - `require_auth()` - Require authenticated user
  - `get_auth_user()` - Get auth user if available
  - `has_role(role)` - Check user role
  - `is_admin()` - Check admin role
  - `require_admin()` - Require admin access

## Integration with REST API

The GraphQL auth implementation reuses the existing REST API auth services:

- All GraphQL resolvers call the same auth service functions
- Same validation logic and error handling
- Consistent response formats
- Shared authentication middleware

## Example GraphQL Queries

### User Registration

```graphql
mutation RegisterUser {
  register(input: { username: "johndoe", email: "john@example.com", password: "SecurePass123!", firstName: "John", lastName: "Doe" }) {
    id
  }
}
```

### User Login

```graphql
mutation LoginUser {
  login(input: { email: "john@example.com", password: "SecurePass123!" }) {
    user {
      id
      username
      email
      role
      firstName
      lastName
    }
    accessToken
    refreshToken
    tokenType
    expiresIn
  }
}
```

### Get Current User

```graphql
query Me {
  me {
    id
    username
    email
    role
    firstName
    lastName
    isActive
  }
}
```

### Token Refresh

```graphql
mutation RefreshToken {
  refresh(input: { refreshToken: "your_refresh_token_here" }) {
    accessToken
    refreshToken
    tokenType
    expiresIn
  }
}
```

## Authentication Headers

For authenticated requests, include the JWT token in the Authorization header:

```
Authorization: Bearer your_access_token_here
```

Or use cookies (same as REST API):

```
Cookie: access_token=your_access_token_here
```

## Completing the Integration

To complete the GraphQL integration, you need to:

1. **Add GraphQL handler to HTTP server**: Update the HTTP server to include a proper GraphQL handler that extracts authentication from request headers.

2. **Set up the GraphQL endpoint**: Replace the placeholder GraphQL routes with actual async-graphql-axum handlers.

3. **Configure authentication middleware**: Ensure the GraphQL context properly extracts and validates JWT tokens from requests.

4. **Test the implementation**: Use the GraphQL playground to test all auth operations.

## Example Integration Code

Here's how to integrate the GraphQL handler:

```rust
// In your HTTP routes
use async_graphql_axum::{GraphQLRequest, GraphQLResponse};
use axum::extract::Extension;

pub async fn graphql_handler(
    Extension(app_context): Extension<Arc<AppContext>>,
    req: GraphQLRequest,
) -> GraphQLResponse {
    let schema = create_schema(app_context.clone());

    // Extract auth from headers (implement this)
    let auth_user = extract_auth_from_request(&req).await;

    // Create context
    let ctx = GraphQLContext::new(app_context, auth_user);

    // Execute request
    schema.execute(req.into_inner().data(ctx)).await.into()
}
```

## Security Features

- **Input validation**: All inputs are validated using the `validator` crate
- **Password strength**: Strong password requirements enforced
- **JWT authentication**: Secure token-based authentication
- **Role-based access**: Admin and user role support
- **Rate limiting**: Can be added at the HTTP layer
- **CORS support**: Configurable through HTTP middleware

## Benefits

1. **Consistent API**: GraphQL auth operations match REST API behavior
2. **Type Safety**: Strong typing for all inputs and outputs
3. **Code Reuse**: Leverages existing auth business logic
4. **Good Structure**: Clean separation of concerns
5. **Extensible**: Easy to add new auth operations
6. **Standard Patterns**: Follows GraphQL best practices

## Next Steps

1. Complete the HTTP integration
2. Add comprehensive tests
3. Add subscription support if needed
4. Consider adding field-level permissions
5. Add monitoring and logging
6. Document the API schema

The foundation is complete and ready for final integration!
