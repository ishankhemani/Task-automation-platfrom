# Task Automation & Job Processing Platform

A scalable, production-ready monorepo platform for scheduling, automating, and monitoring async background jobs, queues, and workflows.

## Technology Stack

### Frontend (`apps/frontend`)

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit (global app state) & TanStack Query (server state & caching)
- **Real-Time Updates**: Socket.IO Client

### Backend (`apps/backend`)

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Queue & Caching**: Redis + BullMQ (asynchronous job processing, scheduling & worker pools)
- **Real-Time Server**: Socket.IO Server

### Shared Package (`packages/shared`)

- Shared TypeScript interfaces, DTOs, Enums, constants, and Zod validation schemas.

---

## Directory Structure

```
Task-Automation-Platform/
├── apps/
│   ├── frontend/             # React + Vite client app
│   └── backend/              # Node.js + Express API & BullMQ worker
├── packages/
│   └── shared/               # Cross-app TypeScript types & schemas
├── docs/                     # Platform architecture & specs
├── docker-compose.yml        # Docker compose setup for DB, Redis, API, Worker, Client
├── Dockerfile.backend        # Production Docker container definition for Backend
├── Dockerfile.frontend       # Production Docker container definition for Frontend
└── package.json              # Monorepo root workspace configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **Docker & Docker Compose** (for running PostgreSQL and Redis)

### Installation

1. Clone the repository and install workspace dependencies:

   ```bash
   npm install
   ```

2. Copy environment file template:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL and Redis via Docker Compose:

   ```bash
   npm run docker:up
   ```

4. Generate Prisma Client:

   ```bash
   npm run prisma:generate
   ```

5. Run development servers (Frontend & Backend):
   ```bash
   npm run dev
   ```

---

## Documentation

Detailed documentation is available in the `docs/` folder:

- [Architecture & System Flow](docs/ARCHITECTURE.md)
- [API Specification](docs/API_SPECIFICATION.md)
- [Queue & Worker Architecture](docs/QUEUE_SYSTEM.md)
- [Developer Setup Guide](docs/SETUP_GUIDE.md)

---

## License

MIT
