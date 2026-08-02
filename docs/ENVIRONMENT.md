# Environment Variables

## Backend (`apps/backend/.env` or root `.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development, production) | `development` |
| `PORT` | API server port | `4000` |
| `HOST` | API server host binding | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/task_automation_db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT signing | `super-secret-jwt-key` |
| `CORS_ORIGIN` | Allowed origin for frontend requests | `http://localhost:5173` |

## Frontend (`apps/frontend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:4000/api/v1` |
| `VITE_SOCKET_URL` | Backend Socket.IO URL | `http://localhost:4000` |
