# Execute Academy – VPS Deployment Guide

This guide explains how to deploy the project on a fresh VPS using Docker Compose, with `nginx` as the reverse proxy, the Rust API, Next.js web app, PostgreSQL, and Redis.

> Quick start uses HTTP on port 80 (or 8080 as in the default compose). A production section covers HTTPS and hardening.

---

## Prerequisites

- A VPS (Ubuntu 22.04+ recommended) with root or sudo access
- A domain (optional but recommended) pointed to your server’s public IP via DNS A record
- Open firewall ports:
  - 80 (HTTP) and 443 (HTTPS) for production
  - 22 (SSH)
- Installed:
  - Docker Engine and Docker Compose plugin

### Install Docker and Compose (Ubuntu)

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
# log out and back in to take effect (or run `newgrp docker`)
```

---

## Get the code on the server

```bash
cd ~
# If not already present
git clone https://github.com/your-org/execute-academy.git exacademy
cd exacademy
```

---

## Environment and configuration

The repository ships a working `docker-compose.yml` that wires up these services:

- `nginx` (reverse proxy)
- `api` (Rust service, port 9098)
- `web` (Next.js server, port 3000)
- `postgres` (PostgreSQL 16)
- `redis` (Redis 7)

Important configuration notes:

- By default, `nginx` maps container port 80 to host port 8080. For production, map to host port 80 (and 443 for TLS).
- Default credentials in the compose and example envs are insecure and must be changed.
- The API container runs DB migrations and seeds an admin user automatically on startup.

### Production compose file (recommended)

Use `docker-compose.prod.yml` provided in the repo for production-safe overrides (ports, restart policies, removed DB/Redis host ports, persisted uploads, env via `.env.production`).

- Create `.env.production` at the repo root:

```env
POSTGRES_PASSWORD=change_me
JWT_SECRET=your-long-random-secret
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this
PUBLIC_API_BASE_URL=https://your-domain
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your@email
SMTP_PASSWORD=app-password
SMTP_STARTTLS=true
EMAIL_FROM=no-reply@your-domain
EMAIL_FROM_NAME=Execute Academy
VIMEO_TOKEN=your-vimeo-token
```

- Start with production overrides:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

- Health check:

```bash
curl -i http://YOUR_SERVER_IP/api/health
```

Note: DB/Redis are not bound to host ports in production; access them via the container network. Uploads persist via the `uploads_data` volume.

### Create a Compose override for production

Create `docker-compose.override.yml` to override sensitive values and ports without touching the base file.

```yaml
# docker-compose.override.yml
services:
  nginx:
    # Expose on standard HTTP port; add 443 when you enable TLS
    ports:
      - "80:80"

  api:
    environment:
      # Bind on all interfaces inside the container
      API_HOST: "0.0.0.0"
      API_PORT: "9098"
      # Use a strong DB password; matches postgres env below
      DATABASE_URL: "postgres://execute_academy:${POSTGRES_PASSWORD:-change_me}@postgres:5432/execute_academy?sslmode=disable"
      REDIS_URL: "redis://redis:6379/0"
      # Replace with real values in production
      VIMEO_TOKEN: "replace-with-real-token"
      ADMIN_USERNAME: "admin"
      ADMIN_EMAIL: "admin@example.com"
      ADMIN_PASSWORD: "replace-with-strong-password"
      JWT_SECRET: "replace-with-strong-random-secret"
      # SMTP/Email (example: Gmail SMTP or your provider)
      SMTP_HOST: "smtp.gmail.com"
      SMTP_PORT: "587"
      SMTP_USERNAME: "your@email"
      SMTP_PASSWORD: "app-password-or-provider-secret"
      SMTP_STARTTLS: "true"
      EMAIL_FROM: "no-reply@example.com"
      EMAIL_FROM_NAME: "Execute Academy"
      # Kafka is optional; leave unset if you don't run it
      # KAFKA_BROKERS: "kafka:9092"
      # KAFKA_EMAIL_TOPIC: "emails"
      # KAFKA_CLIENT_ID: "execute_academy_api"

  postgres:
    environment:
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD:-change_me}"
      # Do NOT trust all connections in production
      POSTGRES_HOST_AUTH_METHOD: ""
    # Recommended: do not publish DB to the host in production
    ports: []

  redis:
    # Recommended: do not publish Redis to the host in production
    ports: []
```

- You can also supply a `.env` file in the repository root to inject variables like `POSTGRES_PASSWORD`.
- For production, avoid mapping `postgres` and `redis` to host ports. Keep them accessible only within the Compose network.

---

## Quick start (HTTP)

This brings the stack up with HTTP only. You can enable HTTPS later.

```bash
# From the repo root
docker compose pull --ignore-buildable
docker compose build
# Start in the background
docker compose up -d

# Check health
docker compose ps
curl -i http://YOUR_SERVER_IP:80/api/health    # if you used the override to expose 80
# or, if you kept the default mapping in base compose:
# curl -i http://YOUR_SERVER_IP:8080/api/health
```

Access the web app in a browser at `http://YOUR_SERVER_IP/` (or your domain).

---

## Enable HTTPS (production)

There are multiple ways to add TLS. Two common approaches:

### Option A: Use a modern proxy (Traefik or Caddy)

- Pros: Automatic certificates and renewals, minimal config
- Cons: Adds one more image

Example (Traefik) sketch:

- Add a `traefik` service, label the `nginx` service for routing, and remove host port mappings from `nginx` (let Traefik listen on 80/443).
- Consult Traefik docs for production labels and ACME configuration.

### Option B: Nginx + Certbot

1. Update `nginex/nginx.conf`:
   - Set `server_name your.domain`.
   - Add a location for ACME challenges:

```nginx
location ^~ /.well-known/acme-challenge/ {
    root /var/www/certbot;
}
```

2. Mount a webroot and cert volumes to `nginx` in an override file:

```yaml
services:
  nginx:
    volumes:
      - certbot-www:/var/www/certbot
      - certbot-conf:/etc/letsencrypt
    ports:
      - "80:80"
      - "443:443"
volumes:
  certbot-www:
  certbot-conf:
```

3. Run a Certbot container (webroot mode) to obtain certs, then add TLS blocks to Nginx.

> If you prefer simplicity, Option A (Traefik/Caddy) is usually faster to get right.

---

## Operational commands

- View logs:

```bash
docker compose logs -f nginx
docker compose logs -f api
docker compose logs -f web
```

- Restart services after config changes:

```bash
docker compose up -d --build
```

- Update to latest version:

```bash
git pull
docker compose pull --ignore-buildable
docker compose build --pull
docker compose up -d
```

- Connect to a shell inside a container:

```bash
docker compose exec api /bin/sh
```

---

## Database management and backups

- The DB data persists in the `postgres_data` volume. Back it up regularly.

- Create a logical backup (dump):

```bash
# Create a dump inside the container
docker compose exec -T postgres pg_dump -U execute_academy -d execute_academy > backup_$(date +%F).sql
```

- Restore from a dump:

```bash
cat backup.sql | docker compose exec -T postgres psql -U execute_academy -d execute_academy
```

---

## Security hardening checklist

- Change all default credentials and secrets:
  - `POSTGRES_PASSWORD`, `ADMIN_PASSWORD`, `JWT_SECRET`, SMTP creds, etc.
- Do not publish `postgres` and `redis` to the host (remove ports).
- Restrict SSH access and use key-based auth.
- Keep Docker and images up to date. Use `--pull` when rebuilding.
- If using Gmail SMTP, use an App Password and 2FA.
- Consider separate managed DB/Redis in production for resilience.

---

## Service URLs (by default wiring)

- API (through Nginx): `http(s)://your-domain/api/...`
- Health check: `http(s)://your-domain/api/health`
- Web app: `http(s)://your-domain/`

> Internally, Nginx proxies `/api/*` to `api:9098` and forwards other traffic to `web:3000`.

---

## Notes on Kafka (optional)

The API supports Kafka for email queueing, but it is not required. If you enable Kafka:

- Add a Kafka service or point `KAFKA_BROKERS` to your cluster.
- Ensure network reachability from the `api` container.

---

## Troubleshooting

- API not healthy:

  - Check DB connectivity and `DATABASE_URL`
  - Ensure migrations ran (entrypoint runs them automatically)
  - Check `JWT_SECRET` and SMTP config if auth/email fails

- 502/504 from Nginx:

  - Check `web` and `api` containers are healthy
  - Confirm `nginx` upstreams match service names and ports

- DB/Redis exposed:
  - Remove host `ports:` from `postgres` and `redis` in your override, or block externally via firewall

---

If you need a fully automated HTTPS setup, consider switching the front proxy to Traefik/Caddy for automatic certificate management.
