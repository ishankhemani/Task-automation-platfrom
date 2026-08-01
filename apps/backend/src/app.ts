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

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Base route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy', timestamp: new Date().toISOString() });
});

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;
