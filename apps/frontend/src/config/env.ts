import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default('http://localhost:4000/api/v1'),
  VITE_SOCKET_URL: z.string().default('http://localhost:4000'),
  MODE: z.string().default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
});

const parseEnv = () => {
  const envData = {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1',
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
    MODE: import.meta.env.MODE || 'development',
    DEV: import.meta.env.DEV ?? true,
    PROD: import.meta.env.PROD ?? false,
  };

  const result = envSchema.safeParse(envData);
  if (!result.success) {
    console.error('❌ Environment validation error:', result.error.format());
    return envData;
  }
  return result.data;
};

export const env = parseEnv();
