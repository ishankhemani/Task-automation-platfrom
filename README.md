# Task Automation & Job Processing Platform

> A scalable, production-ready **enterprise SaaS platform** for scheduling, automating, and monitoring asynchronous background jobs, queues, and distributed task workflows — built with a full MERN-adjacent stack (React · Node.js · PostgreSQL · Redis · BullMQ · Socket.IO).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Folder Structure](#folder-structure)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [API Documentation](#api-documentation)
8. [Assumptions](#assumptions)
9. [Trade-offs](#trade-offs)
10. [Future Improvements](#future-improvements)

---

## Project Overview

The **Task Automation & Job Processing Platform** is a full-stack, real-time enterprise dashboard that enables teams to:

- **Create & Schedule Tasks** — define job payloads with priority levels (LOW / MEDIUM / HIGH / CRITICAL) and optional delayed scheduling
- **Process Jobs Asynchronously** — BullMQ dispatches jobs to Redis-backed worker pools with concurrency control, automatic retries, and exponential backoff
- **Monitor in Real-Time** — Socket.IO broadcasts live `job:progress`, `job:completed`, and `job:failed` events directly to the browser dashboard
- **Audit Every Execution** — every task maintains a full status-transition history, execution logs, and linked notifications
- **Control Access by Role** — three-tier RBAC (ADMIN / USER / VIEWER) enforced at both the API middleware and UI route-guard level
- **Manage at Scale** — Admin panel for user management, queue pause/resume, system metrics (CPU, RAM, worker heartbeats), and activity audit logs

### Key Features

| Feature | Details |
|---|---|
| Authentication | JWT access tokens + httpOnly refresh token cookies, bcrypt password hashing |
| Real-Time Updates | Socket.IO — live task progress bar, instant job completion/failure toasts |
| Background Jobs | BullMQ over Redis — 4 isolated queues (default, priority, scheduled, workflow) |
| Role-Based Access | ADMIN · USER · VIEWER — API middleware + React RoleGuard |
| File Uploads | Multer — profile avatars & task attachments, stored on disk |
| Notifications | In-app notification drawer (mark read / mark all read) + toast alerts |
| Analytics | Recharts — time-series charts, priority/status pie distribution, 7–90 day range |
| Admin Controls | Pause/resume queues, user role updates, system logs export |
| Search & Filter | Debounced search, multi-field filters, server-side pagination |
| Dark / Light Mode | CSS variables, `localStorage` persistence, smooth theme switching |

---

## Tech Stack

### Frontend — `apps/frontend`

| Category | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| UI Components | shadcn/ui (Radix primitives) + Vanilla CSS (CSS variables design system) |
| Styling | Custom CSS with HSL token system — dark/light mode |
| State (Global) | Redux Toolkit (`authSlice`, `uiSlice`, `socketSlice`) |
| State (Server) | TanStack Query v5 (data fetching, caching, invalidation) |
| Real-Time | Socket.IO Client |
| Charts | Recharts (AreaChart, BarChart, LineChart, PieChart) |
| Forms | React Hook Form + Zod resolver |
| Animations | Framer Motion |
| Routing | React Router v6 (lazy-loaded routes, ProtectedRoute, RoleGuard) |
| Icons | Lucide React |
| Toasts | Sonner |

### Backend — `apps/backend`

| Category | Technology |
|---|---|
| Runtime | Node.js ≥ 20 + Express 4 |
| Language | TypeScript 5 |
| ORM | Prisma 5 (PostgreSQL) |
| Queue Engine | BullMQ over Redis |
| Real-Time | Socket.IO 4 |
| Auth | JSON Web Tokens (jsonwebtoken) + bcrypt |
| Validation | Zod |
| Logging | Pino (structured JSON logs) |
| File Upload | Multer |
| API Docs | Swagger (OpenAPI 3.0) at `/api/docs` |
| Security | Helmet · CORS · express-rate-limit · cookie-parser · input sanitization |
| Testing | Vitest + mocking |

### Shared Package — `packages/shared`

| Category | Technology |
|---|---|
| Types & Interfaces | TypeScript interfaces for all domain entities |
| Validation Schemas | Zod schemas (loginSchema, registerSchema, createTaskSchema, …) |
| Constants | Queue names, Socket event names, Role enums, Priority enums |

### Infrastructure

| Category | Technology |
|---|---|
| Database | PostgreSQL 15 |
| Cache / Queue | Redis 7 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions (`.github/workflows/`) |
| Reverse Proxy | NGINX (production) |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER CLIENT                              │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  React 18 + Vite · Redux Toolkit · TanStack Query           │   │
│  │  Pages: Dashboard · Tasks · Queues · Analytics · Admin      │   │
│  └────────────────────┬──────────────────┬───────────────────── ┘  │
└───────────────────────┼──────────────────┼─────────────────────────┘
                        │  HTTP REST       │  WebSocket (Socket.IO)
                        ▼                  ▼
┌───────────────────────────────────────────────────────────────────┐
│                     EXPRESS API SERVER                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │  Auth    │  │  Tasks   │  │  Admin   │  │  Notifications│    │
│  │  Module  │  │  Module  │  │  Module  │  │  Module       │    │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐    │
│  │Dashboard │  │Analytics │  │ Uploads  │  │  Queue Module │    │
│  │  Module  │  │  Module  │  │  Module  │  │  Module       │    │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘    │
│                                                                   │
│  Middleware Stack: authenticate · requireRole · rateLimiter ·     │
│  helmet · sanitize · CSRF token · requestLogger · errorHandler    │
└────────────────┬──────────────────────────┬───────────────────────┘
                 │ Prisma ORM               │ BullMQ Job Enqueue
                 ▼                          ▼
┌───────────────────────┐      ┌──────────────────────────────────┐
│    PostgreSQL 15       │      │           Redis 7                │
│                        │      │                                  │
│  Users                 │      │  ┌────────────┐ ┌────────────┐  │
│  Tasks                 │      │  │task:default│ │task:priority│ │
│  TaskHistory           │      │  └────────────┘ └────────────┘  │
│  TaskLogs              │      │  ┌────────────┐ ┌────────────┐  │
│  QueueJobs             │      │  │task:scheduled│ │task:workflow│ │
│  Notifications         │      │  └────────────┘ └────────────┘  │
│  ActivityLogs          │      │                                  │
│  Uploads               │      │  CacheService (dashboard stats)  │
│  RefreshTokens         │      └────────────────┬─────────────────┘
└───────────────────────┘                        │ Job Dequeue
                                                  ▼
                              ┌───────────────────────────────────┐
                              │         BullMQ WORKER POOL        │
                              │                                   │
                              │  worker-{uuid} processes:         │
                              │  1. Set task → PROCESSING         │
                              │  2. Report progress (25/50/75%)   │
                              │  3a. Success → COMPLETED          │
                              │      + Create Notification        │
                              │      + Emit job:completed         │
                              │      + Invalidate cache           │
                              │  3b. Failure → FAILED             │
                              │      + Increment retryCount       │
                              │      + Create Error Notification  │
                              │      + Emit job:failed            │
                              └───────────────────────────────────┘
```

### Data Flow Summary

1. **Client** submits a `POST /api/v1/tasks` request with title, priority, optional scheduledTime
2. **API** validates input (Zod), saves Task record to PostgreSQL (status: `PENDING`), enqueues a BullMQ job
3. **BullMQ Worker** picks up the job, transitions Task to `PROCESSING`, processes in steps, reports progress
4. **Socket.IO** broadcasts `job:progress` / `job:completed` / `job:failed` events to all connected clients
5. **React Client** receives socket events → TanStack Query cache invalidation → UI updates instantly

---

## Folder Structure

```
Task-Automation-Platform/
│
├── apps/
│   ├── backend/                         # Node.js + Express API & BullMQ workers
│   │   ├── prisma/
│   │   │   ├── schema.prisma            # Full DB schema (9 models)
│   │   │   ├── migrations/              # Prisma migration history
│   │   │   └── seed.ts                  # Database seed script
│   │   └── src/
│   │       ├── app.ts                   # Express app setup & middleware stack
│   │       ├── server.ts                # HTTP server + Socket.IO bootstrap
│   │       ├── config/                  # Environment config (env.ts)
│   │       ├── cache/                   # Redis CacheService (get/set/delete)
│   │       ├── database/                # Prisma client singleton
│   │       ├── docs/                    # Swagger OpenAPI setup
│   │       ├── errors/                  # AppError, NotFoundError, ForbiddenError, …
│   │       ├── middleware/              # auth, csrf, errorHandler, sanitize, requestLogger
│   │       ├── modules/
│   │       │   ├── admin/               # User mgmt, queue control, system metrics
│   │       │   ├── analytics/           # Time-series & distribution data
│   │       │   ├── auth/                # Register, login, logout, refresh, me
│   │       │   ├── dashboard/           # Aggregated stats + recent tasks
│   │       │   ├── health/              # DB + Redis health check endpoint
│   │       │   ├── notifications/       # CRUD notifications per user
│   │       │   ├── queue/               # BullMQ queue stats API
│   │       │   ├── tasks/               # Full task lifecycle CRUD + cancel/retry/duplicate
│   │       │   ├── uploads/             # Multer file upload handler
│   │       │   └── users/               # Profile read/update, password change
│   │       ├── queues/                  # BullMQ Queue Manager (4 queues) + Redis connection
│   │       ├── services/                # Prisma service singleton
│   │       ├── sockets/                 # Socket.IO server init + broadcast helpers
│   │       ├── types/                   # Express augmented types
│   │       ├── utils/                   # asyncHandler, logger, response helpers
│   │       └── workers/                 # BullMQ Worker process (job lifecycle)
│   │
│   └── frontend/                        # React 18 + Vite SPA
│       └── src/
│           ├── api/                     # Axios client (interceptors, refresh logic)
│           ├── components/
│           │   ├── common/              # FileUploader, LoadingSpinner, StatusBadge, …
│           │   ├── data-display/        # DataTable, StatCard, GlassCard, chart wrappers
│           │   ├── feedback/            # NotificationDrawer, EmptyState, ErrorBoundary, Skeletons
│           │   ├── forms/               # FormFieldWrapper
│           │   ├── layout/              # AppLayout, AuthLayout, Header, Sidebar
│           │   ├── navigation/          # CommandPalette
│           │   └── ui/                  # shadcn/ui primitives (button, input, dialog, sheet, …)
│           ├── config/                  # env.ts, constants.ts (ROUTES)
│           ├── features/
│           │   ├── admin/               # AdminUsersPage, AdminWorkersPage, AdminLogsPage
│           │   ├── analytics/           # AnalyticsPage + useAnalyticsQueries
│           │   ├── auth/                # Login, Register, ForgotPassword, ResetPassword pages
│           │   ├── dashboard/           # DashboardPage + useDashboardQueries
│           │   ├── notifications/       # notificationsApi
│           │   ├── profile/             # ProfilePage + profileApi
│           │   ├── queues/              # QueuesPage + useQueueQueries
│           │   ├── settings/            # SettingsPage
│           │   └── tasks/               # TasksPage, TaskBuilderModal, TaskDetailDrawer, filters
│           ├── hooks/                   # useAuth, usePermission, useSocket, useTheme
│           ├── lib/                     # animations, formatters, permissions, queryClient, socket, toast, utils
│           ├── providers/               # AppInitializer, SocketProvider, ThemeProvider
│           ├── routes/                  # createBrowserRouter, ProtectedRoute, GuestRoute, RoleGuard
│           ├── store/                   # Redux store + slices (auth, socket, ui)
│           ├── styles/                  # globals.css, theme.css, tokens.ts
│           └── types/                   # api.ts, auth.ts, user.ts
│
├── packages/
│   └── shared/                          # Cross-app types, Zod schemas, constants
│       └── src/
│           ├── constants/               # QUEUES, SOCKET_EVENTS, ROUTES, ROLES
│           ├── schemas/                 # Zod: loginSchema, registerSchema, createTaskSchema, …
│           └── types/                   # ITask, IUser, IQueueStats, IJobProgressPayload, …
│
├── docs/                                # Full project documentation
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   ├── CODING_STANDARDS.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── ENVIRONMENT.md
│   ├── FEATURE_CHECKLIST.md
│   ├── PRODUCTION_CHECKLIST.md
│   ├── PROJECT_SPEC.md
│   ├── QUEUE_SYSTEM.md
│   ├── SETUP_GUIDE.md
│   ├── SOCKET.md
│   ├── TROUBLESHOOTING.md
│   ├── UI_GUIDELINES.md
│   ├── WORKER_ARCHITECTURE.md
│   └── postman_collection.json
│
├── nginx/                               # NGINX reverse proxy config (production)
├── .github/workflows/                   # CI/CD pipelines
├── Dockerfile.backend                   # Multi-stage backend Docker image
├── Dockerfile.frontend                  # Multi-stage frontend Docker image
├── docker-compose.yml                   # Dev: PostgreSQL + Redis + API + Frontend
├── docker-compose.production.yml        # Production stack with NGINX
├── .env.example                         # Environment variable template
├── tsconfig.base.json                   # Shared TypeScript base config
└── package.json                         # npm workspaces root
```

---

## Installation & Setup

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 20.0.0 |
| npm | ≥ 10.0.0 |
| Docker & Docker Compose | latest stable |
| Git | any |

### Quick Start (Development)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/task-automation-platform.git
cd Task-Automation-Platform

# 2. Install all workspace dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.development
# Edit .env.development with your values (see Environment Variables section)

# 4. Start infrastructure (PostgreSQL + Redis)
npm run docker:up
# or directly: docker-compose up -d

# 5. Run database migrations & generate Prisma client
npm run prisma:generate         # Generate Prisma client
npm run prisma:push             # Push schema to database
npm run prisma:seed             # Seed with default admin user

# 6. Start development servers (frontend + backend concurrently)
npm run dev
```

After startup:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:4000
- **Swagger Docs** → http://localhost:4000/api/docs
- **Default Admin** → `admin@taskplatform.com` / `Admin123!`

### Production Build

```bash
# Build both workspaces
npm run build

# Or via Docker Compose (recommended)
docker-compose -f docker-compose.production.yml up --build -d
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend + backend in watch mode |
| `npm run build` | TypeScript compile + Vite production build |
| `npm test` | Run all Vitest test suites |
| `npm run docker:up` | Start PostgreSQL + Redis containers |
| `npm run docker:down` | Stop all containers |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Sync schema to DB (dev) |
| `npm run prisma:migrate` | Run migrations (production) |
| `npm run prisma:seed` | Seed database with demo data |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run lint` | ESLint across all workspaces |
| `npm run format` | Prettier format all files |

---

## Environment Variables

Copy `.env.example` to `.env.development` (dev) or `.env.production` (prod) and fill in the values:

### Backend Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `NODE_ENV` | `development` | ✅ | Runtime environment (`development` / `production`) |
| `PORT` | `4000` | ✅ | Express server port |
| `HOST` | `0.0.0.0` | ✅ | Server bind address |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/task_automation_db` | ✅ | Full PostgreSQL connection string (Prisma) |
| `POSTGRES_USER` | `postgres` | ✅ | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | ✅ | PostgreSQL password |
| `POSTGRES_DB` | `task_automation_db` | ✅ | PostgreSQL database name |
| `POSTGRES_PORT` | `5432` | ✅ | PostgreSQL port |
| `REDIS_HOST` | `localhost` | ✅ | Redis hostname |
| `REDIS_PORT` | `6379` | ✅ | Redis port |
| `REDIS_PASSWORD` | _(empty)_ | ⬜ | Redis password (if AUTH enabled) |
| `REDIS_URL` | `redis://localhost:6379` | ✅ | Full Redis connection URL |
| `BULLMQ_CONCURRENCY` | `5` | ✅ | Max concurrent jobs per worker |
| `BULLMQ_MAX_STALLED_COUNT` | `2` | ✅ | Max stalled job retries |
| `CORS_ORIGIN` | `http://localhost:5173` | ✅ | Allowed CORS origin(s) |
| `JWT_SECRET` | _(change in prod!)_ | ✅ | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | `7d` | ✅ | JWT access token expiry |

### Frontend Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:4000/api/v1` | ✅ | Backend REST API base URL |
| `VITE_SOCKET_URL` | `http://localhost:4000` | ✅ | Socket.IO server URL |

> **Security Note**: Never commit `.env` files with real credentials. Rotate `JWT_SECRET` and database passwords for every environment.

---

## API Documentation

All endpoints are prefixed with `/api/v1`. Interactive Swagger UI is available at **`GET /api/docs`** when the server is running.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register a new user account |
| `POST` | `/auth/login` | — | Authenticate and receive JWT + refresh token |
| `GET` | `/auth/me` | 🔒 | Get current authenticated user profile |
| `POST` | `/auth/refresh` | — | Exchange refresh token for new access token |
| `POST` | `/auth/logout` | 🔒 | Invalidate current session & revoke refresh token |
| `POST` | `/auth/forgot-password` | — | Request password reset email |
| `POST` | `/auth/reset-password` | — | Reset password via token |

### Tasks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/tasks` | 🔒 | List tasks (pagination, status/priority/search filters) |
| `POST` | `/tasks` | 🔒 | Create & enqueue a new task |
| `GET` | `/tasks/:id` | 🔒 | Get task details + history + execution logs |
| `PATCH` | `/tasks/:id` | 🔒 | Update task metadata |
| `DELETE` | `/tasks/:id` | 🔒 | Soft delete a task |
| `POST` | `/tasks/:id/cancel` | 🔒 | Cancel a pending/processing task |
| `POST` | `/tasks/:id/retry` | 🔒 | Re-enqueue a failed task |
| `POST` | `/tasks/:id/duplicate` | 🔒 | Clone a task to a new pending task |

### Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/dashboard/stats` | 🔒 | Aggregated metrics (total, pending, processing, completed, failed, success rate) |
| `GET` | `/dashboard/recent` | 🔒 | Recent task operations feed |

### Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/analytics?days=7` | 🔒 | Time-series, priority distribution, status distribution |

### Queue Management

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/queues/stats` | 🔒 | BullMQ queue metrics (waiting, active, completed, failed) |
| `GET` | `/queues/workers` | 🔒 | Active worker node stats |

### Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/notifications` | 🔒 | List user notifications (latest 20) |
| `PATCH` | `/notifications/:id/read` | 🔒 | Mark single notification as read |
| `POST` | `/notifications/read-all` | 🔒 | Mark all notifications as read |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/profile` | 🔒 | Get own profile |
| `PATCH` | `/users/profile` | 🔒 | Update name / avatar |
| `PATCH` | `/users/change-password` | 🔒 | Change password (requires current password) |

### Uploads

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/uploads` | 🔒 | Upload file (multipart/form-data), returns URL |

### Admin (ADMIN role required)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/users` | 🔒🛡️ | List all users (search, role filter, pagination) |
| `PATCH` | `/admin/users/:id` | 🔒🛡️ | Update user role or status |
| `DELETE` | `/admin/users/:id` | 🔒🛡️ | Soft delete a user |
| `GET` | `/admin/workers` | 🔒🛡️ | System metrics (CPU, RAM, worker nodes, queue stats) |
| `GET` | `/admin/logs` | 🔒🛡️ | Task execution logs (level filter, pagination) |
| `GET` | `/admin/activity` | 🔒🛡️ | User activity audit logs |
| `POST` | `/admin/queues/:name/pause` | 🔒🛡️ | Pause a BullMQ queue |
| `POST` | `/admin/queues/:name/resume` | 🔒🛡️ | Resume a paused BullMQ queue |

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | Server health check (DB + Redis connectivity) |

### WebSocket Events (Socket.IO)

#### Server → Client

| Event | Payload | Description |
|---|---|---|
| `job:progress` | `{ taskId, jobId, progress, status }` | Emitted at 25 / 50 / 75 / 100% worker progress |
| `job:completed` | `{ taskId, jobId, status, result }` | Job finished successfully |
| `job:failed` | `{ taskId, jobId, status, error }` | Job encountered an unrecoverable error |
| `metrics:update` | `IQueueStats[]` | Periodic queue depth broadcast |
| `notification:new` | `Notification` | New notification pushed to user's room |

#### Client → Server

| Event | Payload | Description |
|---|---|---|
| `subscribe:task` | `taskId: string` | Subscribe to updates for a specific task room |
| `unsubscribe:task` | `taskId: string` | Leave a task room |

### Standard Response Envelope

All REST responses follow this structure:

```jsonc
// Success
{
  "success": true,
  "message": "Task created successfully",
  "data": { /* ... */ },
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}

// Error
{
  "success": false,
  "message": "Task not found",
  "statusCode": 404,
  "errors": []
}
```

---

## Assumptions

1. **Single-instance worker in development** — The BullMQ worker runs in the same Node.js process as the Express API. In production it is expected to be separated as an independent process (see `Dockerfile.backend` `CMD` option). The platform is designed to support horizontal worker scaling.

2. **Redis is required** — Even for basic task creation, Redis must be available. Without it, BullMQ queue operations will throw and tasks will not be processed. The health check endpoint reflects this dependency.

3. **File storage is local disk** — Uploaded files are served from the `/uploads` directory via `express.static`. This assumes a single-server or shared-volume setup. In a cloud deployment, this should be replaced with S3 or GCS (the upload service is designed with an abstraction layer for this).

4. **Email sending is not implemented** — Forgot-password and reset-password endpoints create the token/flow but do not actually send emails. An SMTP transport (e.g. Nodemailer + SendGrid) would be wired into `auth.service.ts` in production.

5. **Simulated task processing** — Workers simulate execution by sleeping for ~1.5s and updating progress. Real production use would replace the `processJob` function body with actual business logic (API calls, data transforms, file processing, etc.).

6. **Workflow Builder is v2** — The schema has a `workflows` directory placeholder and the shared package exports workflow types, but the multi-step DAG workflow builder UI and backend orchestration are deferred to a v2 release.

7. **One database per environment** — The Prisma schema uses soft deletes (`deletedAt`) throughout, assuming no physical record purging in production without a manual process.

---

## Trade-offs

| Decision | Chosen Approach | Alternative Considered | Reason |
|---|---|---|---|
| **Monorepo structure** | npm workspaces | Turborepo / Nx | Lower tooling overhead, avoids build-tool lock-in for a mid-sized project |
| **State management split** | Redux Toolkit (auth/UI) + TanStack Query (server) | React Context + SWR | Redux for cross-cutting concerns (auth, socket state); TanStack Query for declarative server-state caching and invalidation |
| **Worker colocation** | Same process as API in dev | Separate microservice | Simpler local development; easily extracted by splitting the `server.ts` entrypoint |
| **Local file storage** | `express.static` + Multer | AWS S3 / Cloudinary | Avoids external service dependencies for the assessment; abstraction layer ready for swap |
| **BullMQ over Agenda/Bull** | BullMQ | Agenda (MongoDB), Bull (legacy) | BullMQ is the modern successor to Bull with TypeScript-first design, better performance, and atomic job operations |
| **Soft deletes** | `deletedAt` timestamp on all models | Hard delete / archive table | Preserves referential integrity and audit trail without data loss risk |
| **Zod on both ends** | Shared Zod schemas in `packages/shared` | Separate backend/frontend validation | Single source of truth; prevents validation drift; enables type inference on forms via `z.infer<>` |
| **CSS variables design system** | Custom HSL token system | Tailwind utility classes | Full control over the design system, dark mode without the Tailwind purge complexity, smaller CSS bundle |
| **Notification polling** | React Query + 30s refetch interval + Socket.IO push | Pure WebSocket | Hybrid approach: socket for real-time delivery, polling as a fallback / catch-up mechanism |
| **JWT + httpOnly refresh token** | Dual-token rotation | Session cookies / Firebase Auth | Industry-standard stateless auth with XSS-resistant token storage |

---

## Future Improvements

### Short-Term (v1.1)

- [ ] **Email notifications** — Integrate Nodemailer + SendGrid/SES for password reset, task completion alerts, and weekly digest emails
- [ ] **Two-factor authentication (2FA)** — TOTP-based 2FA using `speakeasy` or `otplib`
- [ ] **Advanced task scheduling** — Full cron expression support in the task builder (currently only one-time delay is supported)
- [ ] **Export & reporting** — CSV/PDF export for analytics charts and task history
- [ ] **Rate limit per user** — Per-user API rate limits using Redis sliding window counters (currently global only)

### Medium-Term (v2.0)

- [ ] **Workflow Builder** — Visual DAG editor for multi-step workflows with step dependencies, parallel branches, conditional logic, and retry policies per step
- [ ] **Webhook triggers** — Allow external systems to trigger tasks via authenticated webhook endpoints
- [ ] **Cloud file storage** — AWS S3 / GCS integration for uploads (abstract storage service is already in place)
- [ ] **Multi-tenant support** — Organisation / workspace isolation with tenant-scoped RBAC
- [ ] **Advanced observability** — OpenTelemetry traces, Prometheus metrics endpoint, Grafana dashboard

### Long-Term (v3.0)

- [ ] **Microservice extraction** — Separate the BullMQ worker into an independently deployable, horizontally scalable service with auto-scaling via Kubernetes HPA
- [ ] **Plugin / integration marketplace** — Allow users to install pre-built task templates (Slack notification, S3 sync, Salesforce update, etc.)
- [ ] **GraphQL subscription layer** — Replace Socket.IO events with GraphQL subscriptions for more structured real-time API contracts
- [ ] **SSO / OAuth2** — GitHub, Google, and enterprise SAML/LDAP identity provider support
- [ ] **Dead Letter Queue UI** — Dedicated DLQ management page to inspect, requeue, or discard failed jobs in bulk

---

## Documentation

Full documentation is in the `docs/` directory:

| Document | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture and data flow |
| [API_SPECIFICATION.md](docs/API_SPECIFICATION.md) | Full REST + WebSocket API reference |
| [QUEUE_SYSTEM.md](docs/QUEUE_SYSTEM.md) | BullMQ queue & worker architecture |
| [WORKER_ARCHITECTURE.md](docs/WORKER_ARCHITECTURE.md) | Worker lifecycle and concurrency design |
| [SOCKET.md](docs/SOCKET.md) | Socket.IO event reference |
| [ENVIRONMENT.md](docs/ENVIRONMENT.md) | Environment variable reference |
| [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) | Detailed local development setup |
| [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Production deployment with Docker & NGINX |
| [CODING_STANDARDS.md](docs/CODING_STANDARDS.md) | Code style and contribution guidelines |
| [FEATURE_CHECKLIST.md](docs/FEATURE_CHECKLIST.md) | Implementation completion tracker |
| [PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md) | Pre-launch verification checklist |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Common issues and fixes |
| [postman_collection.json](docs/postman_collection.json) | Importable Postman API collection |

---

## License

MIT © 2026 Task Automation Platform
