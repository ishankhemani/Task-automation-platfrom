# API Specification

## REST Endpoints Overview

All REST API endpoints are prefixed with `/api/v1`.

### Authentication & User Management

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - Authenticate user & issue JWT
- `GET /api/v1/auth/me` - Fetch current user profile
- `POST /api/v1/auth/logout` - Invalidate current session

### Task Management

- `GET /api/v1/tasks` - List all tasks with pagination & status filters
- `POST /api/v1/tasks` - Create a new task / enqueue job
- `GET /api/v1/tasks/:id` - Fetch task execution details and output logs
- `PATCH /api/v1/tasks/:id/cancel` - Cancel a pending or active task
- `POST /api/v1/tasks/:id/retry` - Re-trigger a failed task

### Workflow Automation

- `GET /api/v1/workflows` - List workflow templates
- `POST /api/v1/workflows` - Create a workflow definition
- `GET /api/v1/workflows/:id` - Fetch workflow details
- `POST /api/v1/workflows/:id/execute` - Trigger execution of workflow pipeline

### Queue Metrics & Monitoring

- `GET /api/v1/queues/stats` - Fetch overall BullMQ queue metrics (active, waiting, completed, failed)
- `GET /api/v1/queues/workers` - List registered worker nodes and health status

---

## WebSocket Events (Socket.IO)

### Server -> Client Events

- `job:progress` - Emitted when a BullMQ job reports progress (`{ taskId, progressPercentage, stepName }`)
- `job:completed` - Emitted when a job successfully finishes (`{ taskId, result, durationMs }`)
- `job:failed` - Emitted when a job encounters an error (`{ taskId, error, attemptCount }`)
- `metrics:update` - Periodic broadcast of queue depth and throughput statistics

### Client -> Server Events

- `subscribe:task` - Subscribe to updates for a specific task ID
- `unsubscribe:task` - Unsubscribe from task updates
