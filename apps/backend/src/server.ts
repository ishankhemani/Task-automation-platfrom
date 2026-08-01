import http from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/index.js';

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: config.cors.origin,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

server.listen(config.port, config.host, () => {
  logger.info(`Server running on http://${config.host}:${config.port}`);
});
