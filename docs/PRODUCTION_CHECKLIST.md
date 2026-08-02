# Production Checklist

## Security
- [x] Helmet installed and configured
- [x] CORS tightly scoped to frontend origin
- [x] Rate limiting configured on APIs
- [x] JWT Secret changed from default in `.env`
- [x] Database password is secure
- [x] Nginx security headers implemented

## Observability
- [x] JSON structured logging enabled (Pino)
- [x] Request ID and Correlation ID logging
- [x] Worker ID logged with BullMQ jobs
- [x] Health check endpoints accessible (`/api/v1/health/*`)
- [x] Execution time tracked for API requests and Workers

## Performance
- [x] Node.js backend runs in cluster mode or with sufficient PM2/Docker instances
- [x] Redis connection pooling optimized
- [x] Database connection pooling optimized via Prisma
- [x] Frontend assets minified, lazy loaded
- [x] Nginx gzip compression and asset caching enabled

## CI/CD & Docker
- [x] Multi-stage Dockerfiles used for minimal image size
- [x] `.dockerignore` prevents accidental source inclusion
- [x] GitHub Actions workflow for linting, testing, and building
- [x] Docker Compose configured with networks, volumes, and limits

## Infrastructure
- [x] Backups scheduled for PostgreSQL database
- [x] SSL/TLS certificate installed and auto-renewing
- [x] DNS properly configured (A records, CNAMEs)
