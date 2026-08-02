import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { config } from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sanitizeInput } from './middleware/sanitize.js';
import { generateCsrfToken } from './middleware/csrf.js';
import { setupSwagger } from './docs/swagger.js';
import authRoutes from './modules/auth/auth.route.js';
import tasksRoutes from './modules/tasks/tasks.route.js';
import dashboardRoutes from './modules/dashboard/dashboard.route.js';
import analyticsRoutes from './modules/analytics/analytics.route.js';
import queueRoutes from './modules/queue/queue.route.js';
import notificationRoutes from './modules/notifications/notifications.route.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Body Parsing & Compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Request Logger
app.use(requestLogger);

// Input Sanitization (XSS protection)
app.use(sanitizeInput);

// CSRF Token Generation
app.use(generateCsrfToken);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Swagger Documentation
setupSwagger(app);

import path from 'path';
import uploadsRoutes from './modules/uploads/uploads.route.js';
import usersRoutes from './modules/users/users.route.js';
import adminRoutes from './modules/admin/admin.route.js';

// Serve uploaded files statically
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/queues', queueRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/uploads', uploadsRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/admin', adminRoutes);

import healthRoutes from './modules/health/health.route.js';

// Base route (old health endpoint removed, new modular one added)
app.use('/api/v1/health', healthRoutes);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;
