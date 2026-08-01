# Queue & Worker System Architecture

## BullMQ Topology

The platform leverages BullMQ over Redis to process asynchronous jobs with high reliability.

### Queues

1. **`default-task-queue`**: High-volume standard background jobs (e.g., data transforms, notifications).
2. **`priority-task-queue`**: Urgent tasks demanding minimal queue latency.
3. **`scheduled-task-queue`**: Delayed jobs and cron/repeatable automation tasks.
4. **`workflow-queue`**: Multi-stage workflow orchestrations.

---

## Job Lifecycles & States

```
[Waiting] ---> [Active] ---> [Completed]
                   |
                   v (On Failure)
               [Failed] ---> Retry Backoff ---> [Active]
                   |
                   v (Max Attempts Exceeded)
               [Dead Letter Queue (DLQ)]
```

### Failure Handling & Retries

- **Exponential Backoff**: Failed jobs automatically retry with configured delay scaling (e.g., 2s, 4s, 8s, 16s).
- **Stalled Job Detection**: Redis locks detect crashed worker instances and automatically re-assign jobs to healthy workers.
- **Dead Letter Queue (DLQ)**: Jobs failing beyond maximum retry attempts are persisted in PostgreSQL with diagnostic stack traces for developer review.
