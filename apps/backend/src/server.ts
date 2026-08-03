import app from './app.js';
import { config } from './config/index.js';
import { connectDB } from './database/index.js';
import { logger } from './utils/index.js';
import { initializeQueues } from './queues/index.js';

import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocketServer } from './sockets/index.js';
import { setupWorker } from './workers/index.js';

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching local patterns
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === config.cors.origin) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    credentials: true,
  },
});

initializeSocketServer(io);

export { io };

const startServer = async () => {
  try {
    await connectDB();
    initializeQueues();

    if (config.isWorker) {
      setupWorker();
      logger.info(`⚙️ Background Worker Node running in ${config.env} mode`);
      return;
    }

    if (config.isDevelopment) {
      setupWorker();
    }

    server.listen(config.port, () => {
      logger.info(`🚀 Server running in ${config.env} mode on port ${config.port}`);
      logger.info(`📚 Swagger docs available at http://localhost:${config.port}/api/docs`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server:');
    process.exit(1);
  }
};

startServer();
