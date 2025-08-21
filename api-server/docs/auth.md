# Auth API

Obtain and manage JWT tokens for authenticated requests.

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

Response 200:

```json
{ "id": "<uuid>" }
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
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Logout

- POST `/api/auth/logout`

Response 200:

```json
{ "ok": true }
```

## Authorization Header

Send `Authorization: Bearer <access_token>` for protected endpoints.
