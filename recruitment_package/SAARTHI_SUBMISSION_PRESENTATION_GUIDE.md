# 📄 SAARTHI AI ASSESSMENT: COMPLETE SUBMISSION DOCUMENTATION & PPT VIDEO PRESENTATION GUIDE

**Platform Name**: Task Automation & Job Processing Platform  
**Target Evaluation**: Saarthi AI Full Stack Engineering Assessment  
**Author / Presenter**: Full Stack Software Engineer Candidate  

---

## TABLE OF CONTENTS

1. [Part A: Technical Submission Documentation](#part-a-technical-submission-documentation)
   - 1. Project Overview
   - 2. Tech Stack
   - 3. Architecture Diagram
   - 4. Folder Structure
   - 5. Installation Steps
   - 6. Environment Variables
   - 7. API Documentation
   - 8. Assumptions Made
   - 9. Trade-offs
   - 10. Future Improvements
2. [Part B: 5–10 Minute Video Recording PPT Slide Deck & Presentation Script](#part-b-510-minute-video-recording-ppt-slide-deck--presentation-script)
   - Slide 1: Title & Executive Summary
   - Slide 2: High-Level Architecture & System Data Flow
   - Slide 3: Monorepo & Codebase Organization
   - Slide 4: Authentication & Security Flow (JWT + Refresh Rotation)
   - Slide 5: Distributed Queue Processing (BullMQ & Worker Engine)
   - Slide 6: Database Architecture (PostgreSQL & Prisma Models)
   - Slide 7: Real-Time Communication (Socket.IO + React Query Sync)
   - Slide 8: Key Engineering & Architectural Decisions
   - Slide 9: Trade-offs & Production Considerations
   - Slide 10: Future Roadmap & Improvements

---

# PART A: TECHNICAL SUBMISSION DOCUMENTATION

---

### 1. Project Overview

The **Task Automation & Job Processing Platform** is a full-stack, enterprise-grade distributed workflow and job execution dashboard built for the **Saarthi AI Technical Assessment Challenge**.

The system enables teams to:
- **Create & Schedule Tasks**: Define payloads with priority tiers (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) and delayed execution support.
- **Process Asynchronously**: BullMQ dispatches jobs to Redis-backed worker pools featuring concurrency limits, backoff retries, and dead letter handling.
- **Monitor in Real-Time**: Socket.IO broadcasts live progress (`25%`, `50%`, `75%`, `100%`), completion, and failure events to active web clients.
- **Enforce Security & RBAC**: Three-tier Role-Based Access Control (`ADMIN`, `USER`, `VIEWER`) enforced via Express middleware and React route guards.
- **Admin System Control**: Dedicated admin suite for user lifecycle management, worker heartbeat monitoring, queue pause/resume controls, and system log export.

---

### 2. Tech Stack

#### Frontend (`apps/frontend`)
- **Core Engine**: React 18 + Vite 5 + TypeScript 5
- **Styling & UI**: Custom Vanilla CSS Tokens + Radix UI Primitives + Tailwind Utilities + Framer Motion
- **State Architecture**: 
  - **Redux Toolkit**: Client UI state (`authSlice`, `themeSlice`)
  - **TanStack Query (v5)**: Server state fetching, caching, deduplication, and socket-driven cache invalidation
- **Real-Time & Forms**: Socket.IO Client + React Hook Form + Zod Resolvers + Recharts

#### Backend (`apps/backend`)
- **Runtime**: Node.js 20 + Express 4 + TypeScript 5
- **ORM & Database**: Prisma ORM 5.9 + PostgreSQL 16
- **Asynchronous Queue Engine**: BullMQ 5.1 over Redis 7 (`ioredis`)
- **Real-Time Server**: Socket.IO Server 4.7
- **Security & Logging**: Helmet (CSP headers) + CORS + Express Rate Limit + Pino Structured Logger + Swagger OpenAPI 3.0

#### Infrastructure & Shared Contracts
- **Shared Contracts (`packages/shared`)**: Shared TypeScript interfaces, Zod schemas, and system constants across client and server.
- **Containerization**: Docker Multi-Stage Builds + Docker Compose + Nginx Reverse Proxy.

---

### 3. Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          REACT 18 SPA CLIENT                           │
│  (React Router v6 · Redux Toolkit · TanStack Query v5 · Socket.IO)     │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ REST API                       │ WebSockets
                    ▼                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS 4 REST API SERVER                       │
│ (Helmet CSP · CORS · Rate Limiter · Auth Guard · Pino Logger · Swagger)│
└─────────┬─────────────────────────┬───────────────────────────┬────────┘
          │ Prisma ORM              │ Job Enqueue               │ Event Broadcast
          ▼                         ▼                           ▼
┌───────────────────┐    ┌────────────────────┐    ┌─────────────────────┐
│   POSTGRESQL 16   │    │      REDIS 7       │    │ SOCKET.IO EVENT BUS │
│ (9 Schema Models) │    │  (BullMQ Queues)   │    │  (job:progress/done)│
└───────────────────┘    └──────────┬─────────┘    └─────────────────────┘
                                    │ Job Dequeue
                                    ▼
                         ┌────────────────────┐
                         │   BULLMQ WORKERS   │
                         │ (Task Processing)  │
                         └────────────────────┘
```

---

### 4. Folder Structure

```
Task-Automation-Platform/
├── apps/
│   ├── backend/
│   │   ├── prisma/                  # schema.prisma (9 models), seed.ts, migrations/
│   │   └── src/
│   │       ├── app.ts               # Express app bootstrap & middleware pipeline
│   │       ├── server.ts            # Server entrypoint + Socket.IO bootstrap
│   │       ├── middleware/          # auth, csrf, errorHandler, requestLogger, sanitize
│   │       ├── modules/             # admin, analytics, auth, dashboard, health, tasks, uploads, users
│   │       ├── queues/              # QueueManager.ts (BullMQ) & Redis config
│   │       ├── sockets/             # socketServer.ts (Socket.IO events)
│   │       └── workers/             # taskWorker.ts (Async processing logic)
│   └── frontend/
│       └── src/
│           ├── api/                 # Axios client with refresh interceptors
│           ├── components/          # Layout, UI components, charts, drawers, modals
│           ├── features/            # Feature modules (admin, auth, dashboard, tasks, queues)
│           ├── hooks/               # useAuth, usePermission, useSocket, useTheme
│           ├── store/               # Redux store & slices
│           └── routes/              # ProtectedRoute, RoleGuard, Router config
├── packages/
│   └── shared/                      # Shared types, Zod schemas, Enums
├── nginx/                           # Nginx production reverse proxy config
├── docker-compose.yml               # Multi-container local/dev stack
├── Dockerfile.backend               # Backend multi-stage build
├── Dockerfile.frontend              # Frontend multi-stage build
└── .env.example                     # Environment template
```

---

### 5. Installation Steps

```bash
# 1. Clone repository
git clone <your-repo-url>
cd Task-Automation-Platform

# 2. Start containerized stack via Docker Compose
docker compose up --build -d

# 3. Verify healthy running containers
docker compose ps

# 4. Open applications in browser
# Frontend SPA:      http://localhost
# Swagger API Docs:  http://localhost/api/docs
# API Healthcheck:   http://localhost/api/v1/health/ready
```

---

### 6. Environment Variables

Key parameters in `.env.example`:
```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/task_automation_db?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
JWT_ACCESS_SECRET=super-secret-jwt-access-token-key-change-in-production
JWT_REFRESH_SECRET=super-secret-jwt-refresh-token-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

### 7. API Documentation

Comprehensive REST API endpoints exposed under `/api/v1`:
- **Auth**: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`
- **Tasks**: `GET /tasks`, `POST /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id`, `POST /tasks/:id/cancel`, `POST /tasks/:id/retry`, `POST /tasks/:id/duplicate`
- **Dashboard & Analytics**: `GET /dashboard/stats`, `GET /dashboard/recent`, `GET /analytics`
- **Admin**: `GET /admin/users`, `PATCH /admin/users/:id`, `GET /admin/workers`, `GET /admin/logs`, `POST /admin/queues/:name/pause`

---

### 8. Assumptions Made

1. **Redis Availability**: Task creation enqueues jobs directly into BullMQ; Redis connectivity is mandatory.
2. **Local Storage Isolation**: File uploads are handled via disk storage (`/uploads`) mounted in volumes.
3. **Simulated Worker Load**: Workers execute tasks in 4 staged iterations to simulate real CPU-bound computations and emit socket progress.
4. **V2 Scope Definition**: Multi-step visual workflow builders are deferred to v2 (documented in `FEATURE_CHECKLIST.md`).

---

### 9. Trade-offs

| Design Choice | Selection | Alternative | Technical Rationale |
| :--- | :--- | :--- | :--- |
| **Monorepo Architecture** | `npm` Workspaces | Turborepo / Nx | Minimizes setup friction while enforcing strict shared TypeScript contracts. |
| **State Management** | Redux + TanStack Query | Context API / SWR | Redux handles client session/UI while TanStack Query provides automatic caching and socket invalidation. |
| **Database ORM** | Prisma | TypeORM / Knex | Provides compile-time type safety, automated migrations, and relations mapping. |
| **Job Queue Engine** | BullMQ + Redis | Agenda / RabbitMQ | Native TypeScript support, fast atomic operations, and backoff retries. |

---

### 10. Future Improvements

- **Short-Term**: SMTP email dispatch for password resets, multi-factor authentication (2FA).
- **Medium-Term**: S3 cloud storage adapter, visual DAG workflow editor, webhook triggers.
- **Long-Term**: Kubernetes HPA worker auto-scaling, OpenTelemetry distributed tracing.

---

# PART B: 5–10 MINUTE VIDEO RECORDING PPT SLIDE DECK & PRESENTATION SCRIPT

*Use the 10 slides below for your Loom / screen recording presentation.*

---

### 🖼️ SLIDE 1: Title & Executive Summary
- **Slide Heading**: Task Automation & Distributed Job Processing Platform
- **Visuals**: Title slide showing Tech Stack logos (React, Node.js, PostgreSQL, Redis, BullMQ, Docker).
- **Spoken Script**:
  > *"Hello everyone! Today I'm presenting the Task Automation and Job Processing Platform built for the Saarthi AI Technical Assessment. This system is a full-stack, distributed enterprise SaaS dashboard engineered for real-time task scheduling, background job execution, worker monitoring, and role-based administration."*

---

### 🖼️ SLIDE 2: High-Level Architecture & Data Flow
- **Slide Heading**: System Architecture & Asynchronous Workflow
- **Visuals**: Architecture Flowchart (Client ➔ Express API ➔ PostgreSQL & Redis ➔ BullMQ Worker ➔ Socket.IO ➔ Client UI).
- **Spoken Script**:
  > *"Looking at the architecture, the client communicates with an Express REST backend. When a user creates a task, it's validated using Zod, saved to PostgreSQL, and enqueued into a Redis-backed BullMQ queue. A pool of distributed BullMQ workers picks up the job, processes it asynchronously, and emits live WebSockets progress events via Socket.IO directly back to the React UI without requiring page reloads."*

---

### 🖼️ SLIDE 3: Monorepo & Codebase Organization
- **Slide Heading**: Monorepo Structure (`apps/` & `packages/shared`)
- **Visuals**: Folder tree diagram highlighting `apps/frontend`, `apps/backend`, and `packages/shared`.
- **Spoken Script**:
  > *"The codebase is organized as a clean npm monorepo. `packages/shared` contains single-source-of-truth TypeScript interfaces, Enums, and Zod validation schemas shared by both frontend and backend. The backend follows a strict layered architecture—Routes to Controllers to Services to Repositories—ensuring modularity and SOLID design principles."*

---

### 🖼️ SLIDE 4: Authentication & Security Architecture
- **Slide Heading**: Dual-Token JWT Auth & 3-Tier RBAC
- **Visuals**: Security flow diagram showing Access Token + HttpOnly Refresh Cookie & Role-Based Access Matrix.
- **Spoken Script**:
  > *"For security, we implement password hashing using bcrypt and a dual-token JWT architecture: short-lived access tokens stored in memory paired with HttpOnly secure refresh token rotation stored in the database. Role-Based Access Control enforces strict permissions across Admin, Standard User, and Viewer tiers both at the API middleware level and React route guards."*

---

### 5. 🖼️ SLIDE 5: Queue Processing & Distributed Workers
- **Slide Heading**: Asynchronous Job Engine (BullMQ + Redis)
- **Visuals**: BullMQ Queue diagram (`default`, `high-priority`, `scheduled`), concurrency controls, and backoff retries.
- **Spoken Script**:
  > *"Background processing is handled by BullMQ over Redis. Tasks are categorized by priority with concurrency controls. If a job fails, BullMQ automatically triggers exponential backoff retries. Workers log execution steps into PostgreSQL and publish progress updates across the real-time event bus."*

---

### 🖼️ SLIDE 6: Database Design & Prisma ORM Schema
- **Slide Heading**: Database Schema (PostgreSQL + Prisma)
- **Visuals**: Entity Relationship Diagram showing `User`, `Task`, `TaskHistory`, `TaskLog`, `QueueJob`, `Notification`, and `Upload`.
- **Spoken Script**:
  > *"Our database layer uses PostgreSQL with Prisma ORM. The schema consists of 9 fully normalized entities. We maintain referential integrity with foreign keys, index critical status and priority columns for performance, and record full audit trails in `task_history` and `task_logs`."*

---

### 🖼️ SLIDE 7: Real-Time Communication & State Synchronization
- **Slide Heading**: Socket.IO Integration & Client State Sync
- **Visuals**: WebSockets flow diagram showing worker progress emitting events to TanStack Query cache invalidators.
- **Spoken Script**:
  > *"Real-time features are powered by Socket.IO. When a worker updates job progress (25%, 50%, 75%, 100%), it broadcasts events to the client. The frontend uses a dual-tier state architecture: Redux Toolkit for UI state and TanStack Query for server state. Socket events automatically invalidate TanStack Query caches, updating stats and toast alerts instantly."*

---

### 🖼️ SLIDE 8: Key Engineering & Architectural Decisions
- **Slide Heading**: Engineering Highlights & Best Practices
- **Visuals**: Key callout boxes: Type Safety, Security Headers (Helmet CSP), Pino Structured Logging, Multi-Stage Docker Builds.
- **Spoken Script**:
  > *"Key engineering highlights include strict end-to-end type safety, automated OpenAPI Swagger documentation, structured Pino logging, and complete containerization using multi-stage Dockerfiles and Nginx reverse proxying."*

---

### 🖼️ SLIDE 9: Trade-offs & Production Considerations
- **Slide Heading**: Trade-offs & Technical Rationale
- **Visuals**: Table comparing chosen approaches vs alternatives (npm workspaces, Redux + React Query, local storage).
- **Spoken Script**:
  > *"We made deliberate technical trade-offs: selecting npm workspaces for lightweight monorepo management, utilizing local disk storage with an abstraction layer ready for AWS S3 swap, and implementing simulated worker loads for assessment demonstration."*

---

### 🖼️ SLIDE 10: Future Roadmap & Closing Remarks
- **Slide Heading**: Future Enhancements & Summary
- **Visuals**: Roadmap timeline (v1.1 SMTP/2FA ➔ v2.0 Visual Workflow Editor & S3 ➔ v3.0 K8s Auto-scaling).
- **Spoken Script**:
  > *"In summary, the platform meets all assessment requirements with production-ready code quality, robust security, and scalable infrastructure. Future enhancements include visual DAG workflow builders and Kubernetes auto-scaling. Thank you for your time!"*

---

*Documentation & Video Presentation Guide generated for Saarthi AI Technical Assessment Submission.*
