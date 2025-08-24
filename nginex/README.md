# Nginx reverse proxy for production

This folder contains a production-ready Nginx config that fronts the Next.js app and Rust API.

- Web (Next.js) runs in container `web` on port 3000
- API (Rust) runs in container `api` on port 8080
- Nginx listens on port 80 and proxies:
  - `/api/*` -> `api:8080`
  - everything else -> `web:3000`

## Local production run

```bash
# From repo root
docker compose build --no-cache
docker compose up -d
# Access:
# Web: http://localhost
# API (via Nginx): http://localhost/api/health
```

## Notes

- Internal service discovery uses Docker's default network (`api`, `web`, `nginx`).
- `web` receives `API_BASE_URL=http://api:8080` so server-side requests hit the API directly inside the network.
- External clients should call the API through Nginx as `/api/...`.

## TLS (optional)

For HTTPS, you can:

- Terminate TLS at Nginx with certificates mounted into `/etc/nginx/certs`, and add a `server` block on `443` with `ssl_certificate` and `ssl_certificate_key`.
- Or use a cloud load balancer/ingress in front of Nginx.
