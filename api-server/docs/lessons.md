# Lessons API

Base URL: `http://127.0.0.1:8080`

All responses are wrapped in the standard envelope documented in `./index.mdx`.

Authentication:

- Creating/updating/deleting lessons typically requires an admin token.
- Send header: `Authorization: Bearer <token>` when required.

## List Lessons for a Module

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

## Create Lesson

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

## Update Lesson

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

## Delete Lesson

- DELETE `/api/lessons/:id`

Response 200: envelope with `{ "id": "<uuid>" }`.

Example:

```bash
curl -X DELETE \
  http://127.0.0.1:8080/api/lessons/<lesson_id> \
  -H "Authorization: Bearer $TOKEN"
```

## Upload Lesson Video (Vimeo)

- POST `/api/lessons/:id/video`

Consumes `multipart/form-data` and uploads the provided file to Vimeo. On success, the lesson's `video_url` is updated with the Vimeo link.

Multipart fields:

- `file` (required): binary video file
- `name` (optional): video title (defaults to filename or `lesson-video`)
- `description` (optional): video description
- `privacy_view` (optional): Vimeo privacy option (default from env `VIMEO_PRIVACY_VIEW`, fallback `unlisted`)
- `content_type` (optional): MIME type, defaults to `video/mp4`

Response 200: envelope with updated lesson.

Example:

```bash
curl -X POST \
  http://127.0.0.1:8080/api/lessons/<lesson_id>/video \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/video.mp4" \
  -F "name=Introduction video" \
  -F "description=Welcome to the course" \
  -F "privacy_view=unlisted"
```

Notes:

- Uploaded videos are stored on Vimeo. Deleting lessons or courses does not delete the Vimeo video.
