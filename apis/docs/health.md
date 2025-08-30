# Health API

- GET `/api/health`

Response 200:

```json
{
  "message": "OK",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "status_code": 200,
  "data": {
    "service": "execute_academy",
    "overall_status": "healthy",
    "components": {
      "postgres": { "status": "up" },
      "redis": { "status": "up" }
    }
  }
}
```
