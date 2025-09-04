#!/bin/bash

# Generate GraphQL Schema Documentation
# This script generates comprehensive GraphQL documentation

set -e

echo "🚀 Generating GraphQL Documentation..."

# Create docs directory if it doesn't exist
mkdir -p docs/graphql

# Generate schema introspection query
cat > docs/graphql/schema-introspection.graphql << 'EOF'
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description
      locations
      args {
        ...InputValue
      }
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
              }
            }
          }
        }
      }
    }
  }
}
EOF

echo "📝 Generated schema introspection query"

# Generate example queries
cat > docs/graphql/example-queries.graphql << 'EOF'
# Execute Academy GraphQL Example Queries

# Welcome Query
query WelcomeQuery {
  welcome {
    message
    service
    version
  }
}

# Health Check Query
query HealthCheckQuery {
  health {
    service
    overallStatus
    components {
      postgres {
        status
        detail
      }
      redis {
        status
        detail
      }
    }
  }
}

# Combined Query
query SystemInfoQuery {
  welcome {
    message
    service
    version
  }
  health {
    service
    overallStatus
    components {
      postgres {
        status
        detail
      }
      redis {
        status
        detail
      }
    }
  }
}
EOF

echo "📝 Generated example queries"

# Generate schema documentation
cat > docs/graphql/schema.md << 'EOF'
# GraphQL Schema Documentation

## Types

### QueryRoot

The root query type for the Execute Academy GraphQL API.

#### Fields

##### welcome: WelcomeMessage

Returns a welcome message with service information.

**Example:**
```graphql
{
  welcome {
    message
    service
    version
  }
}
```

##### health: HealthReport

Returns the health status of the system and its dependencies.

**Example:**
```graphql
{
  health {
    service
    overallStatus
    components {
      postgres {
        status
        detail
      }
      redis {
        status
        detail
      }
    }
  }
}
```

### WelcomeMessage

Information about the service welcome message.

#### Fields

- **message** (String!): The welcome message text
- **service** (String!): The name of the service
- **version** (String!): The API version

### HealthReport

System health information including component status.

#### Fields

- **service** (String!): The name of the service
- **overallStatus** (String!): Overall health status ("healthy" or "degraded")
- **components** (ComponentsStatus!): Status of individual components

### ComponentsStatus

Status information for system components.

#### Fields

- **postgres** (ComponentStatus!): PostgreSQL database status
- **redis** (ComponentStatus!): Redis cache status

### ComponentStatus

Status information for an individual component.

#### Fields

- **status** (String!): Component status ("up" or "down")
- **detail** (String): Error details if component is down (nullable)

## Scalar Types

### String

A UTF-8 character sequence.

## Schema Information

- **Query Type**: QueryRoot
- **Mutation Type**: null (no mutations currently available)
- **Subscription Type**: null (no subscriptions currently available)

## Usage Examples

### Basic Welcome Query

```graphql
query {
  welcome {
    message
  }
}
```

### Health Check

```graphql
query {
  health {
    overallStatus
    components {
      postgres {
        status
      }
      redis {
        status
      }
    }
  }
}
```

### Full System Information

```graphql
query {
  welcome {
    message
    service
    version
  }
  health {
    service
    overallStatus
    components {
      postgres {
        status
        detail
      }
      redis {
        status
        detail
      }
    }
  }
}
```
EOF

echo "📝 Generated schema documentation"

# Generate API reference
cat > docs/graphql/api-reference.md << 'EOF'
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
EOF

echo "📝 Generated API reference"

echo "✅ GraphQL documentation generated successfully!"
echo ""
echo "📁 Generated files:"
echo "  - docs/graphql/schema-introspection.graphql"
echo "  - docs/graphql/example-queries.graphql"
echo "  - docs/graphql/schema.md"
echo "  - docs/graphql/api-reference.md"
echo ""
echo "🌐 Access the GraphQL Playground at: http://localhost:9099/graphql"
echo ""
echo "📖 View the main documentation: GRAPHQL_API_DOCS.md"
