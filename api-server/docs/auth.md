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
