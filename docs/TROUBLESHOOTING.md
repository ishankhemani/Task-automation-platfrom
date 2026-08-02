# Troubleshooting

## Common Issues

### 1. Database Connection Refused
**Symptom**: Backend fails to start with `PrismaClientInitializationError`.
**Fix**: Ensure PostgreSQL container is running and healthy. Check `docker-compose ps`. If running locally, ensure no other service is occupying port 5432.

### 2. Redis Connection Failed
**Symptom**: BullMQ fails to connect, workers do not process tasks.
**Fix**: Verify Redis container is running. Check `REDIS_HOST` and `REDIS_PORT`. Ensure the network name matches in Docker Compose.

### 3. ESM / Module Not Found Errors
**Symptom**: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '...' imported from ...`
**Fix**: Ensure all TypeScript imports end with `.js` extensions. The project uses ES Modules (`"type": "module"`).

### 4. CORS Errors on Frontend
**Symptom**: Fetch requests from React are blocked by CORS policy.
**Fix**: Update the `CORS_ORIGIN` environment variable in the backend to exactly match the frontend URL (e.g., `https://yourdomain.com`). Do not include a trailing slash.

### 5. Docker Build Fails on dependencies
**Symptom**: `npm ci` fails inside Dockerfile.
**Fix**: Check if `package-lock.json` is synced. Run `npm install` locally to update lockfiles, then rebuild Docker image.
