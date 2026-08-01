# Architecture & System Flow

## Overview

The Task Automation & Job Processing Platform is designed as a distributed, event-driven system capable of processing async tasks, scheduled jobs, and complex workflows at scale.

## Core System Architecture

```
                                  +-------------------+
                                  |   React Client    |
                                  | (Vite / Redux /   |
                                  | TanStack Query)   |
                                  +---------+---------+
                                            |
                                  HTTP REST / WebSockets
                                            |
                                            v
                                  +-------------------+
                                  | Express API Node  |
                                  | (Auth, Task Producer, |
                                  | Socket Manager)   |
                                  +----+--------+-----+
                                       |        |
                         Prisma Queries|        |BullMQ Job Enqueue
                                       v        v
    +-------------------+           +-----+  +-------------------+
    | PostgreSQL DB     |<----------+ DB  |  | Redis Cache &     |
    | (Users, Tasks,    |           +-----+  | BullMQ Queues     |
    | Workflows, Logs)  |                    +---------+---------+
    +-------------------+                              |
                                                       |Job Dequeue & Processing
                                                       v
                                             +-------------------+
                                             |  BullMQ Worker    |
                                             |  Processes        |
                                             | (Task Execution)  |
                                             +-------------------+
```

## System Components

1. **Frontend App (`apps/frontend`)**:
   - Built with React, Vite, Tailwind CSS, and shadcn/ui.
   - Manages state via Redux Toolkit (auth, active workspace, socket notifications) and TanStack Query (task lists, queue metrics, execution logs).
   - Receives real-time job progress and state updates via Socket.IO.

2. **Backend API (`apps/backend`)**:
   - Node.js + Express REST API server.
   - Handles client authentication, workflow definition, task dispatching, and queue statistics monitoring.
   - Serves as the Socket.IO server to broadcast job events to connected frontend clients.

3. **Database Layer (PostgreSQL & Prisma)**:
   - Primary persistent store for Users, Workflows, Task Templates, Executions, and Audit Logs.

4. **Queue & In-Memory Store (Redis & BullMQ)**:
   - Redis powers BullMQ job queues, caching layer, rate limiters, and Pub/Sub mechanism.
   - BullMQ orchestrates concurrency, job retries, exponential backoffs, dead-letter queues (DLQ), and delayed/cron tasks.

5. **Worker Pool (`apps/backend` Worker Mode)**:
   - Decoupled worker processes running dedicated BullMQ consumers.
   - Executes cpu-bound, I/O-bound, or external API integration tasks asynchronously.
