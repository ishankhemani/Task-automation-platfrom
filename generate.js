const fs = require('fs');
const path = require('path');

const basePath = '/home/ishan-khmani/Downloads/Task-Automation-Platform/apps/backend/src/modules';

const modules = ['users', 'tasks', 'queue', 'notifications', 'uploads', 'admin', 'analytics', 'dashboard'];

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const generateFiles = (moduleName) => {
  const dir = path.join(basePath, moduleName);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const Module = capitalize(moduleName);
  const MODULE = moduleName.toUpperCase();

  const controllerContent = `import { Request, Response } from 'express';
import { ${Module}Service } from './${moduleName}.service.js';
import { sendSuccess } from '../../utils/index.js';
import type { AuthenticatedRequest } from '../../middleware/auth.js';

export class ${Module}Controller {
  // TODO: Implement controller methods in future parts
}
`;

  const serviceContent = `import { ${Module}Repository } from './${moduleName}.repository.js';
import { logger } from '../../utils/index.js';

export class ${Module}Service {
  // TODO: Implement service methods in future parts
}
`;

  const repositoryContent = `import { prisma } from '../../services/prisma.js';

export class ${Module}Repository {
  // TODO: Implement repository methods in future parts
}
`;

  const routeContent = `import { Router } from 'express';

const router = Router();

// TODO: Add routes in future parts

export default router;
`;

  let validatorContent = `import { z } from 'zod';

// TODO: Add validation schemas in future parts
export const placeholder = z.object({});
`;

  if (moduleName === 'tasks') {
    validatorContent = `import { z } from 'zod';
import { createTaskSchema, updateTaskSchema } from '@task-platform/shared';

// TODO: Add validation schemas in future parts
export { createTaskSchema, updateTaskSchema };
`;
  }

  let dtoContent = `// ${Module} Data Transfer Objects
// TODO: Define DTOs in future parts
export interface ${Module}ListDTO {
  page?: number;
  limit?: number;
}
`;
  if (moduleName === 'tasks') {
    dtoContent += `
export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
}
`;
  } else if (moduleName === 'users') {
    dtoContent += `
export interface UpdateUserDTO {
  // Add fields here
}

export interface UserQueryDTO {
  // Add fields here
}
`;
  } else if (moduleName === 'notifications') {
    dtoContent += `
export interface CreateNotificationDTO {
  // Add fields here
}
`;
  } else if (moduleName === 'uploads') {
    dtoContent += `
export interface UploadResponseDTO {
  // Add fields here
}
`;
  }

  let typesContent = `// ${Module} module types
// TODO: Define types in future parts
`;
  if (moduleName === 'tasks') {
    typesContent += `
export type TaskWithRelations = any; // TODO: refine this type
`;
  }

  let constantsContent = `// ${Module} module constants
export const ${MODULE}_CONSTANTS = {
  // TODO: Add constants in future parts
} as const;

export const ${MODULE}_MESSAGES = {
  // TODO: Add messages in future parts
} as const;
`;
  if (moduleName === 'tasks') {
    constantsContent = `// ${Module} module constants
export const ${MODULE}_CONSTANTS = {
  // TODO: Add constants in future parts
} as const;

export const TASK_MESSAGES = {
  CREATED: 'Task created successfully',
  UPDATED: 'Task updated successfully',
  DELETED: 'Task deleted successfully',
  NOT_FOUND: 'Task not found',
} as const;
`;
  } else if (moduleName === 'users') {
    constantsContent = `// ${Module} module constants
export const ${MODULE}_CONSTANTS = {
  // TODO: Add constants in future parts
} as const;

export const USER_MESSAGES = {
  // TODO: Add messages
} as const;
`;
  } else if (moduleName === 'notifications') {
    constantsContent = `// ${Module} module constants
export const ${MODULE}_CONSTANTS = {
  // TODO: Add constants in future parts
} as const;

export const NOTIFICATION_MESSAGES = {
  // TODO: Add messages
} as const;
`;
  } else if (moduleName === 'uploads') {
    constantsContent = `// ${Module} module constants
export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
} as const;

export const ${MODULE}_MESSAGES = {
  // TODO: Add messages in future parts
} as const;
`;
  }

  fs.writeFileSync(path.join(dir, \`\${moduleName}.controller.ts\`), controllerContent);
  fs.writeFileSync(path.join(dir, \`\${moduleName}.service.ts\`), serviceContent);
  fs.writeFileSync(path.join(dir, \`\${moduleName}.repository.ts\`), repositoryContent);
  fs.writeFileSync(path.join(dir, \`\${moduleName}.route.ts\`), routeContent);
  fs.writeFileSync(path.join(dir, \`\${moduleName}.validator.ts\`), validatorContent);
  fs.writeFileSync(path.join(dir, \`\${moduleName}.dto.ts\`), dtoContent);
  fs.writeFileSync(path.join(dir, \`\${moduleName}.types.ts\`), typesContent);
  fs.writeFileSync(path.join(dir, \`\${moduleName}.constants.ts\`), constantsContent);
};

modules.forEach(generateFiles);
console.log('Done');
