# Real-time Sockets (Socket.IO)

The platform provides real-time updates to clients using Socket.IO.

## Connection
Clients connect to the server at the root or `/` path with the WebSocket transport preferred.
Authentication is handled via handshake auth tokens (`auth: { token: '...' }`).

## Emitted Events
The server emits the following events to the client:
- `task:created`
- `task:updated`
- `job:progress` - Contains `taskId`, `jobId`, and `progress` (0-100).
- `job:completed`
- `job:failed`
- `notification:new`

## Security
- Connections missing a valid JWT token are disconnected immediately.
- CORS is strictly enforced to `CORS_ORIGIN`.
