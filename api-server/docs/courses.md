# Courses API

Base URL: `http://127.0.0.1:8080`

All responses are wrapped in the standard envelope documented in `./index.mdx`.

Authentication:

- Creating/updating/deleting courses, modules, and lessons typically requires an admin token.
- Send header: `Authorization: Bearer <token>` when required.

## Create Course

- POST `/api/courses`

Request:

```json
{
  "slug": "rust-for-beginners",
  "title": "Rust for Beginners",
  "description": "Learn Rust from scratch",
  "excerpt": "Intro course",
  "thumbnail": "https://cdn.example.com/img.png",
  "price": 99.0,
  "original_price": 149.0,
  "duration": "5h",
  "lessons": 20,
  "featured": true,
  "instructor_id": null
}
```

Response 201:

```json
{
  "message": "Course created",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 201,
  "data": "<uuid>"
}
```

Example:

```bash
curl -X POST \
  http://127.0.0.1:8080/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "slug":"rust-for-beginners",
    "title":"Rust for Beginners",
    "description":"Learn Rust",
    "price":99,
    "duration":"5h",
    "lessons":20,
    "featured":false
  }'
```

## List Courses (Paginated)

- GET `/api/courses/paginated`

Query params:

- `page` (optional, default: 1) — 1-based page number
- `per_page` (optional, default: 10, max: 100) — items per page

Response 200:

```json
{
  "message": "Courses",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": {
    "items": [
      {
        "id": "<uuid>",
        "slug": "rust-for-beginners",
        "title": "Rust for Beginners",
        "description": "...",
        "excerpt": null,
        "thumbnail": null,
        "price": 99.0,
        "original_price": null,
        "duration": "5h",
        "lessons": 20,
        "students": 0,
        "published": false,
        "featured": false,
        "view_count": 0,
        "instructor_id": null,
        "published_at": null,
        "created_at": "...",
        "updated_at": null
      }
    ],
    "meta": {
      "page": 1,
      "per_page": 10,
      "total": 42,
      "total_pages": 5
    }
  }
}
```

Example:

```bash
curl "http://127.0.0.1:8080/api/courses/paginated?page=1&per_page=10"
```

## Get Course by ID

- GET `/api/courses/:id`

Response 200 (data truncated):

```json
{
  "message": "Course",
  "status_code": 200,
  "timestamp": "...",
  "data": {
    "id": "<uuid>",
    "slug": "rust-for-beginners",
    "title": "Rust for Beginners",
    "description": "...",
    "excerpt": null,
    "thumbnail": null,
    "price": 99.0,
    "original_price": null,
    "duration": "5h",
    "lessons": 20,
    "students": 0,
    "published": false,
    "featured": false,
    "view_count": 0,
    "instructor_id": null,
    "published_at": null,
    "created_at": "...",
    "updated_at": null
  }
}
```

## Get Course by Slug

- GET `/api/course/:slug`

Response: same shape as "Get Course by ID".

Example:

```bash
curl http://127.0.0.1:8080/api/course/rust-for-beginners
```

## Update Course

- PATCH `/api/courses/:id`

Request (any subset):

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "excerpt": "Updated excerpt",
  "thumbnail": "https://cdn.example.com/new.png",
  "price": 79.0,
  "original_price": 129.0,
  "duration": "6h",
  "lessons": 24,
  "students": 100,
  "published": true,
  "featured": true
}
```

Response 200: envelope with updated Course.

Example:

```bash
curl -X PATCH \
  http://127.0.0.1:8080/api/courses/<uuid> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"published":true,"featured":true}'
```

## Delete Course

- DELETE `/api/courses/:id`

Response 200:

```json
{
  "message": "Deleted",
  "status_code": 200,
  "timestamp": "...",
  "data": { "id": "<uuid>" }
}
```

Example:

```bash
curl -X DELETE \
  http://127.0.0.1:8080/api/courses/<uuid> \
  -H "Authorization: Bearer $TOKEN"
```

---

## Modules

See: `./modules.md`

### List Modules for a Course

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

### Create Module

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

### Update Module

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

### Delete Module

- DELETE `/api/modules/:id`

Response 200: envelope with `{ "id": "<uuid>" }`.

Example:

```bash
curl -X DELETE \
  http://127.0.0.1:8080/api/modules/<module_id> \
  -H "Authorization: Bearer $TOKEN"
```

---

## Lessons

See: `./lessons.md`

### List Lessons for a Module

- GET `/api/modules/:module_id/lessons`

Response 200:

```json
{
  "message": "Lessons",
  "status_code": 200,
  "timestamp": "...",
  "data": [
    {
      "id": "<uuid>",
      "module_id": "<uuid>",
      "title": "Welcome",
      "description": null,
      "content": null,
      "video_url": null,
      "duration": "5m",
      "position": 0,
      "is_free": false,
      "published": false,
      "created_at": "...",
      "updated_at": null
    }
  ]
}
```

### Create Lesson

- POST `/api/modules/:module_id/lessons`

Request:

```json
{
  "module_id": "<uuid>",
  "title": "Welcome",
  "description": null,
  "content": null,
  "video_url": null,
  "duration": "5m",
  "position": 0,
  "is_free": false,
  "published": false
}
```

Response 201: envelope with lesson id (UUID as string).

Example:

```bash
curl -X POST \
  http://127.0.0.1:8080/api/modules/<module_id>/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "module_id":"<module_id>",
    "title":"Welcome",
    "duration":"5m",
    "position":0
  }'
```

### Update Lesson

- PATCH `/api/lessons/:id`

Request (any subset):

```json
{
  "title": "Welcome to the course",
  "description": "...",
  "content": "...",
  "video_url": "https://cdn.example.com/v.mp4",
  "duration": "6m",
  "position": 1,
  "is_free": true,
  "published": true
}
```

Response 200: envelope with updated lesson.

Example:

```bash
curl -X PATCH \
  http://127.0.0.1:8080/api/lessons/<lesson_id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"published":true}'
```

### Delete Lesson

- DELETE `/api/lessons/:id`

Response 200: envelope with `{ "id": "<uuid>" }`.

Example:

```bash
curl -X DELETE \
  http://127.0.0.1:8080/api/lessons/<lesson_id> \
  -H "Authorization: Bearer $TOKEN"
```
