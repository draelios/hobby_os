# Step 1 Implementation Tasks

## Goal

Bootstrap a working self-hosted baseline with app shell, database wiring, and deployment scaffolding.

## Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Set secure `NEXTAUTH_SECRET` and strong database password
- [ ] Build and start stack with `docker compose up --build -d`
- [ ] Confirm containers are healthy with `docker compose ps`
- [ ] Verify app loads at configured domain over HTTPS
- [ ] Run initial migration deployment from web container logs

## Immediate Next Build Tasks

1. Add authentication flow (NextAuth credentials provider)
2. Create first migration from `prisma/schema.prisma`
3. Build unified dashboard cards (Books, Recipes, Finances)
4. Add global quick-add modal scaffold
5. Add initial seed data script

## Useful Commands

- Start stack: `docker compose up --build -d`
- Stop stack: `docker compose down`
- Start localhost mode: `docker compose -f docker-compose.yml -f docker-compose.local.yml up --build -d`
- Stop localhost mode: `docker compose -f docker-compose.yml -f docker-compose.local.yml down`
- View logs: `docker compose logs -f web`
- Run prisma generate: `docker compose exec web npx prisma generate`
- Open db shell: `docker compose exec db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"`
