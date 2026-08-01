# Developer Setup Guide

## Local Development Environment Setup

### 1. Repository Setup

```bash
git clone <repository-url>
cd Task-Automation-Platform
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Spin Up Infrastructure (PostgreSQL & Redis)

Run Docker Compose in detached mode:

```bash
npm run docker:up
```

Verify services are healthy:

```bash
docker-compose ps
```

### 4. Database Setup & Prisma Migration

Generate Prisma Client:

```bash
npm run prisma:generate
```

Apply migrations to local database:

```bash
npm run prisma:migrate
```

### 5. Launch Development Applications

Run all services concurrently:

```bash
npm run dev
```

Or run services individually:

- Backend Server: `npm run dev:backend`
- Frontend Client: `npm run dev:frontend`

---

## Workspace Directory Navigation

- `apps/frontend/src/store/`: Redux Toolkit store definitions
- `apps/frontend/src/api/`: TanStack Query hooks & Axios instance
- `apps/backend/src/queues/`: BullMQ queue setup & worker processors
- `apps/backend/src/sockets/`: Socket.IO real-time event definitions
- `apps/backend/prisma/`: Prisma database schema definitions
- `packages/shared/src/`: Shared TypeScript DTOs, Enums, and Zod Schemas
