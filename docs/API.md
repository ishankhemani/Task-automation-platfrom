# API Documentation

The Task Automation Platform uses a RESTful API with JSON payloads.

## Swagger / OpenAPI

The complete API documentation is auto-generated using Swagger.
In development, visit:
`http://localhost:4000/api/docs`

## Authentication

All protected endpoints require a Bearer token in the Authorization header.
```http
Authorization: Bearer <your_jwt_token>
```

## Core Endpoints
- `POST /api/v1/auth/login` - Authenticate and get tokens
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create a task
- `GET /api/v1/queues/stats` - Get queue statistics
- `GET /api/v1/health` - System health
