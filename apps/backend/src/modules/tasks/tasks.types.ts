import { Task, User, TaskHistory, TaskLog } from '@prisma/client';

export type TaskWithRelations = Task & {
  author?: Partial<User>;
  assignee?: Partial<User> | null;
  history?: TaskHistory[];
  logs?: TaskLog[];
};
