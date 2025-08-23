# Auth API

Obtain and manage JWT tokens for authenticated requests.

Base URL: `http://127.0.0.1:8080`

## Register

- POST `/api/auth/register`

Request:

```json
{
  "first_name": "Alice",
  "last_name": "Doe",
  "username": "alice",
  "email": "alice@example.com",
  "password": "StrongP@ssw0rd"
}
```

Note: `first_name` and `last_name` are accepted during registration but are not persisted at create time. They can be updated later via the user update endpoint.

Additional notes:

- After successful registration, a 6-digit OTP is emailed to the provided address. Use the Verify endpoint below to activate the account.
- New accounts are inactive by default and cannot log in until verified.

Response 200:

```json
{
  "message": "Registered",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": { "id": "<uuid>" }
}
```

## Login

- POST `/api/auth/login`

Request:

```json
{ "email": "alice@example.com", "password": "StrongP@ssw0rd" }
```

Response 200:

```json
{
  "message": "Logged in",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": {
    "user": {
      "id": "<uuid>",
      "username": "alice",
      "email": "alice@example.com",
      "role": "user",
      "first_name": null,
      "last_name": null,
      "full_name": null,
      "avatar_url": null,
      "is_active": true,
      "is_blocked": false
    },
    "access_token": "<jwt>",
    "refresh_token": "<jwt>",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

Notes:

- Login requires an active (verified) account. Inactive accounts will receive a 403 Forbidden error.

## Refresh

- POST `/api/auth/refresh`

Request:

```json
{ "refresh_token": "<jwt>" }
```

Response 200:

```json
{
  "message": "New access token",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": {
    "access_token": "<jwt>",
    "refresh_token": "<jwt>",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

Note: The refresh endpoint returns a new `access_token` and echoes back the provided `refresh_token` unchanged.

## Verify Email (OTP)

- POST `/api/auth/verify`

Request:

```json
{ "email": "alice@example.com", "code": "123456" }
```

Response 200:

```json
{
  "message": "Verified",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": { "ok": true }
}
```

Notes:

- OTP codes expire in 10 minutes.
- Verifying an already active account is treated as success (idempotent).

## Resend OTP

- POST `/api/auth/resend-otp`

Request:

```json
{ "email": "alice@example.com" }
```

Response 200:

```json
{
  "message": "Sent",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": { "ok": true }
}
```

Note: This endpoint sends a fresh OTP only if the account is not yet verified.

## Logout

- POST `/api/auth/logout`

Response 200:

```json
{
  "message": "Ok",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": { "ok": true }
}
```

## Authorization Header

Send `Authorization: Bearer <access_token>` for protected endpoints.
