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
