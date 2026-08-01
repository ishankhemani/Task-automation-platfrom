// Environment configuration - re-exports config for consistent imports
import dotenv from 'dotenv';
dotenv.config();

export { config, config as env } from './index.js';
export type { Config } from './index.js';
