## Execute Academy Infra: MongoDB and Redis

This folder provisions MongoDB and Redis using Docker Compose with persistent volumes and env-based secrets.

### Files

- `docker-compose.yml`: Services for MongoDB and Redis
- `env.example`: Example environment variables. Copy to `.env` or use `--env-file`.

### Quick Start

1. Copy env file and adjust credentials:
   ```bash
   cp env.example .env
   ```
2. Start services:
   ```bash
   cd ece-infra
   docker compose up -d
   ```
   Or from repo root:
   ```bash
   docker compose -f ece-infra/docker-compose.yml --env-file ece-infra/.env up -d
   ```
3. Stop services:
   ```bash
   docker compose down
   ```

### Connection Strings

- MongoDB (auth database is `admin`):
  - `mongodb://admin:change_me@localhost:27017/?authSource=admin`
- Redis:
  - `redis://:change_me@localhost:6379`

### Data Persistence

- MongoDB data: Docker volume `mongo_data`
- Redis data: Docker volume `redis_data`

Volumes are named and persist across container restarts. Remove with `docker volume rm <name>` if needed.

### Notes

- Default credentials are provided for local/dev only. Change them for any non-local use.
- Ports are configurable via env: `MONGODB_PORT`, `REDIS_PORT`.
