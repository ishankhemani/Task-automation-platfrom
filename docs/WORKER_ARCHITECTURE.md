# Worker Architecture

The platform uses BullMQ to process tasks asynchronously.

## Worker Nodes
Workers can be run in the same process as the backend server or scaled horizontally as standalone containers (as seen in `docker-compose.production.yml`).

## Responsibilities
1. Pulling jobs from Redis queues.
2. Executing the task logic.
3. Emitting progress via Socket.IO.
4. Updating the PostgreSQL database with statuses (`PROCESSING`, `COMPLETED`, `FAILED`).
5. Logging execution metrics (Worker ID, Execution Time).

## Concurrency
Worker concurrency is controlled by the `BULLMQ_CONCURRENCY` environment variable (default: 5-10 per worker instance).
