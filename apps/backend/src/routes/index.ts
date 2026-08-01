import { Router } from 'express';
import { healthRouter } from './health.js';

export const router = Router();

// Infrastructure & Health check
router.use('/health', healthRouter);

// Module Route Placeholders for Part 2
router.use('/auth', (_req, res) => {
  res.status(501).json({ success: false, message: 'Auth endpoint skeleton initialized' });
});

router.use('/tasks', (_req, res) => {
  res.status(501).json({ success: false, message: 'Tasks endpoint skeleton initialized' });
});

router.use('/workflows', (_req, res) => {
  res.status(501).json({ success: false, message: 'Workflows endpoint skeleton initialized' });
});

router.use('/queues', (_req, res) => {
  res.status(501).json({ success: false, message: 'Queues endpoint skeleton initialized' });
});

router.use('/workers', (_req, res) => {
  res.status(501).json({ success: false, message: 'Workers endpoint skeleton initialized' });
});

router.use('/logs', (_req, res) => {
  res.status(501).json({ success: false, message: 'Logs endpoint skeleton initialized' });
});

router.use('/analytics', (_req, res) => {
  res.status(501).json({ success: false, message: 'Analytics endpoint skeleton initialized' });
});
