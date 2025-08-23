# Modules API

Base URL: `http://127.0.0.1:8080`

All responses are wrapped in the standard envelope documented in `./index.mdx`.

Authentication:

- Creating/updating/deleting modules typically requires an admin token.
- Send header: `Authorization: Bearer <token>` when required.

## List Modules for a Course

- GET `/api/courses/:course_id/modules`

Response 200:

```json
{
  "message": "Modules",
  "status_code": 200,
  "timestamp": "...",
  "data": [
    {
      "id": "<uuid>",
      "course_id": "<uuid>",
      "title": "Introduction",
      "description": null,
      "position": 0,
      "created_at": "...",
      "updated_at": null
    }
  ]
}
```

## Create Module

- POST `/api/courses/:course_id/modules`

Request:

```json
{
  "course_id": "<uuid>",
  "title": "Introduction",
  "description": null,
  "position": 0
}
```

Response 201: envelope with module id (UUID as string).

Example:

```bash
curl -X POST \
  http://127.0.0.1:8080/api/courses/<course_id>/modules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "course_id":"<course_id>",
    "title":"Introduction",
    "position":0
  }'
```

## Update Module

- PATCH `/api/modules/:id`

Request (any subset):

```json
{ "title": "Intro", "description": "...", "position": 1 }
```

Response 200: envelope with updated module.

Example:

```bash
curl -X PATCH \
  http://127.0.0.1:8080/api/modules/<module_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"position":1}'
```

## Delete Module

- DELETE `/api/modules/:id`

Response 200: envelope with `{ "id": "<uuid>" }`.

Example:

```bash
curl -X DELETE \
  http://127.0.0.1:8080/api/modules/<module_id> \
  -H "Authorization: Bearer $TOKEN"
```
