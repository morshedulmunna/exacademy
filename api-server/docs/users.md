# Users API

## Get User

- GET `/api/users/:id` (UUID)

Response 200:

```json
{
  "id": "<uuid>",
  "username": "alice",
  "email": "alice@example.com",
  "role": "user",
  "first_name": null,
  "last_name": null,
  "full_name": null,
  "avatar_url": null,
  "is_active": true,
  "is_blocked": false,
  "created_at": "2024-01-01T12:34:56.789Z"
}
```

Errors: see [Error Model](crate::api_docs::errors).
