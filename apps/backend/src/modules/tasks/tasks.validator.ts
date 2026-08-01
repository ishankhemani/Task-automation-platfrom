import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be under 200 characters'),
    description: z.string().max(2000, 'Description must be under 2000 characters').optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    scheduledTime: z.string().optional(),
    assignedTo: z.string().uuid('Invalid assigned user ID').optional().nullable(),
    attachment: z.string().optional().nullable(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
    scheduledTime: z.string().optional().nullable(),
    assignedTo: z.string().uuid().optional().nullable(),
    attachment: z.string().optional().nullable(),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    assignedTo: z.string().optional(),
    createdBy: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title', 'priority', 'status']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});
