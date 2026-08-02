import { Router } from 'express';
import {
  getGeneralHealth,
  getLiveness,
  getReadiness,
  getDatabaseHealth,
  getRedisHealth,
  getWorkersHealth,
  getSocketHealth,
} from './health.controller.js';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: General health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get('/', getGeneralHealth);

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is live
 */
router.get('/live', getLiveness);

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe (checks DB & Redis)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is ready to accept traffic
 *       503:
 *         description: Dependencies are not ready
 */
router.get('/ready', getReadiness);

/**
 * @swagger
 * /health/database:
 *   get:
 *     summary: Database health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Database is connected
 *       503:
 *         description: Database is disconnected
 */
router.get('/database', getDatabaseHealth);

/**
 * @swagger
 * /health/redis:
 *   get:
 *     summary: Redis health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Redis is connected
 *       503:
 *         description: Redis is disconnected
 */
router.get('/redis', getRedisHealth);

/**
 * @swagger
 * /health/workers:
 *   get:
 *     summary: Workers health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Workers are active
 *       503:
 *         description: Workers check failed
 */
router.get('/workers', getWorkersHealth);

/**
 * @swagger
 * /health/socket:
 *   get:
 *     summary: Socket.IO health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Socket is active
 *       503:
 *         description: Socket is disconnected
 */
router.get('/socket', getSocketHealth);

export default router;
