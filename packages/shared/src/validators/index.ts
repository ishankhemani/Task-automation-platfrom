// Shared Zod Validation Schemas
import { z } from 'zod';
import { JobPriority } from '../enums/index.js';

export const createTaskSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.string().min(1),
  payload: z.record(z.unknown()).default({}),
  priority: z.nativeEnum(JobPriority).default(JobPriority.NORMAL),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
