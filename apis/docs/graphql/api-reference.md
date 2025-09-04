# GraphQL API Reference

## Endpoints

### GraphQL Endpoint

- **URL**: `http://localhost:9099/graphql`
- **Method**: POST
- **Content-Type**: application/json

### GraphQL Playground

- **URL**: `http://localhost:9099/graphql`
- **Method**: GET
- **Description**: Interactive GraphQL playground for testing queries

## Request Format

All GraphQL requests must be POST requests with JSON body:

```bash
curl -X POST http://localhost:9099/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ welcome { message } }"}'
```

## Response Format

All responses are JSON with the following structure:

```json
{
  "data": {
    // Query results
  },
  "errors": [
    // Any errors that occurred
  ]
}
```

## Error Handling

Errors are returned in the standard GraphQL error format:

```json
{
  "errors": [
    {
      "message": "Error description",
      "locations": [{"line": 2, "column": 3}],
      "path": ["fieldName"]
    }
  ]
}
```

## Rate Limiting

- **Limit**: 25 requests per minute per IP
- **Headers**: 
  - `x-rate-limit-limit`: Maximum requests allowed
  - `x-rate-limit-remaining`: Remaining requests
  - `x-rate-limit-reset`: Reset time

## CORS

Cross-Origin Resource Sharing is enabled for web applications.

## Authentication

Currently no authentication is required. Future versions will include JWT-based authentication.
