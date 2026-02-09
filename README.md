# Hobby OS (Self-Hosted)

A local-server app to manage books, cooking recipes, and personal finances in one place.

## Project Structure

- `app/` - Next.js app (UI + API) and Prisma schema
- `infra/caddy/` - Caddy reverse-proxy config
- `infra/backup/` - automated PostgreSQL backup scripts
- `docs/` - implementation checklists and planning docs

## Quick Start

1. Update secrets and domain values in `.env`
3. Add local DNS/hosts entry for your app domain (for example `hobbies.local`)
4. Start stack:
   - `docker compose up --build -d`
5. Open your app:
   - `https://hobbies.local`

## Localhost Mode (No hosts file, no TLS setup)

Use this when you just want to run and test quickly on your machine.

1. Start with localhost override:
   - `docker compose -f docker-compose.yml -f docker-compose.local.yml up --build -d`
3. Open:
   - `http://localhost:3000`

Notes:

- In localhost mode, the `proxy` service is disabled by default.
- Stop stack with:
  - `docker compose -f docker-compose.yml -f docker-compose.local.yml down`

## Services

- `web` - Next.js app container on internal `:3000`
- `db` - PostgreSQL 16
- `backup` - daily compressed dumps to Docker volume
- `proxy` - Caddy TLS termination and routing

## Step 1 Scope Implemented

- Baseline folder structure
- Docker Compose architecture (web, db, backup, proxy)
- Environment variable template
- Initial app shell + starter Prisma data model
- Step-by-step execution checklist in `docs/STEP1_TASKS.md`
