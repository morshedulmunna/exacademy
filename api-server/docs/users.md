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

Errors: see `api-server/docs/errors.md`.

## Update User

- PATCH `/api/users/:id`

Request (any subset of fields):

```json
{
  "username": "alice2",
  "first_name": "Alice",
  "last_name": "Doe",
  "avatar_url": "https://cdn.example.com/avatars/a.png",
  "bio": "Software engineer",
  "date_of_birth": "1990-05-20",
  "gender": "female",
  "phone": "+1-555-1234",
  "secondary_email": "alice2@example.com",
  "website_url": "https://alice.dev",
  "github_url": "https://github.com/alice",
  "twitter_url": "https://twitter.com/alice",
  "linkedin_url": "https://linkedin.com/in/alice",
  "facebook_url": "https://facebook.com/alice",
  "instagram_url": "https://instagram.com/alice",
  "youtube_url": "https://youtube.com/@alice",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "Metropolis",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "locale": "en-US",
  "timezone": "America/New_York",
  "marketing_opt_in": true
}
```

Response 200: same shape as Get User.
