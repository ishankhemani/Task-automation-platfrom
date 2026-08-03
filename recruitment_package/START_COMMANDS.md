# 🚀 RECRUITING TEAM QUICK START & DEPLOYMENT GUIDE

**Task Automation & Job Processing Platform**  
*Saarthi AI Technical Assessment Challenge*

This package contains all docker configuration files, environment definitions, schema migrations, and startup commands required to deploy and evaluate the application.

---

## 📋 Pre-requisites

- **Docker** & **Docker Compose** installed (Docker Desktop or Docker Engine ≥ 24.0)
- **Node.js** (Optional, only if running outside Docker without containerization)

---

## ⚡ 1-Step Quick Start (Recommended for Evaluators)

Run the following command from the root directory to build and start the entire multi-container stack (**Frontend SPA**, **Express API**, **BullMQ Worker**, **PostgreSQL**, and **Redis**):

```bash
docker compose up --build -d
```

### Check Container Status
```bash
docker compose ps
```

All 5 services should show as `running` / `healthy`:
- `task_platform_postgres` (PostgreSQL 16)
- `task_platform_redis` (Redis 7)
- `task_platform_backend` (Express API)
- `task_platform_worker` (BullMQ Job Worker)
- `task_platform_frontend` (Nginx + React SPA)

---

## 🌐 Application URLs

Once containers are running, access the platform endpoints:

| Interface / Service | URL | Description |
| :--- | :--- | :--- |
| **Web Client Dashboard** | `http://localhost` | React 18 SPA (Nginx Reverse Proxy) |
| **Interactive API Docs** | `http://localhost/api/docs` | Swagger OpenAPI 3.0 Documentation |
| **Backend REST API Base** | `http://localhost/api/v1` | Express API Endpoints |
| **Healthcheck Endpoint** | `http://localhost/api/v1/health/ready` | DB + Redis Connectivity Check |

---

## 🔑 Demo Account Credentials

The database is pre-configured with test users across all Role-Based Access Control (RBAC) tiers:

| User Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@taskplatform.com` | `Admin123!` | Full access (Users, Workers, Queue Pause/Resume, System Logs) |
| **Standard User** | `user@taskplatform.com` | `User123!` | Create, Edit, Retry, Cancel & Clone Tasks; View Analytics |
| **Viewer** | `viewer@taskplatform.com` | `Viewer123!` | Read-only access to Dashboards, Reports, and Task Status |

---

## 🗄️ Database Migrations & Seeding

Migrations run automatically via Prisma upon backend container initialization. If you ever need to manually re-run seed data or reset:

```bash
# Apply database migrations
docker compose exec backend npm run prisma:migrate

# Seed demo users & sample tasks
docker compose exec backend npm run prisma:seed
```

---

## 📜 Key CLI Commands Summary

```bash
# 1. Start all containers in detached mode
docker compose up -d

# 2. View live logs for all services
docker compose logs -f

# 3. View backend logs specifically
docker compose logs -f backend

# 4. View worker execution logs
docker compose logs -f worker

# 5. Stop all containers (preserve volumes)
docker compose down

# 6. Completely reset database and volumes (clean start)
docker compose down -v
```

---

## 🛠️ Package Files Overview

- **`docker-compose.yml`**: Full multi-container composition (Postgres, Redis, API, Worker, Nginx Frontend).
- **`docker-compose.production.yml`**: Production variant with isolated networking and reverse proxy.
- **`Dockerfile.backend`**: Multi-stage Node.js + Prisma build for API and Worker services.
- **`Dockerfile.frontend`**: Multi-stage Vite + Nginx build for the React SPA client.
- **`nginx/nginx.conf`**: Nginx web server config with security headers & API proxying.
- **`.env.example`**: Complete environment configuration template with default parameters.
- **`prisma/`**: PostgreSQL schema (`schema.prisma`), seed script (`seed.ts`), and full migration history SQL files.
- **`README.md`**: Comprehensive architectural specifications, technology stack details, and trade-off documentation.

---

*MIT License © 2026 Task Automation Platform*
