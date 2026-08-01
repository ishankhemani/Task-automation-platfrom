// File upload middleware and configuration
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { AppError } from '../errors/index.js';
import { logger } from '../utils/index.js';

// Upload constants
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  UPLOAD_DIR: path.resolve(process.cwd(), 'uploads'),
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json',
    'application/zip',
    'application/x-tar',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
} as const;

// Storage strategy interface for future S3 migration
export interface StorageStrategy {
  save(file: UploadedFile): Promise<{ path: string; filename: string }>;
  delete(filepath: string): Promise<void>;
  getUrl(filepath: string): string;
}

export interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * Local file system storage strategy
 */
export class LocalStorageStrategy implements StorageStrategy {
  private uploadDir: string;

  constructor(uploadDir: string = UPLOAD_CONFIG.UPLOAD_DIR) {
    this.uploadDir = uploadDir;
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      logger.info(`📁 Created upload directory: ${this.uploadDir}`);
    }
  }

  async save(file: UploadedFile): Promise<{ path: string; filename: string }> {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    await fs.promises.writeFile(filepath, file.buffer);
    logger.info({ filename, originalName: file.originalname, size: file.size }, 'File saved locally');

    return { path: filepath, filename };
  }

  async delete(filepath: string): Promise<void> {
    try {
      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath);
        logger.info({ filepath }, 'File deleted');
      }
    } catch (error) {
      logger.error({ filepath, error }, 'Failed to delete file');
    }
  }

  getUrl(filepath: string): string {
    return `/uploads/${path.basename(filepath)}`;
  }
}

/**
 * AWS S3 storage strategy placeholder for future migration
 */
export class S3StorageStrategy implements StorageStrategy {
  async save(_file: UploadedFile): Promise<{ path: string; filename: string }> {
    // TODO: Implement S3 upload using @aws-sdk/client-s3
    throw new AppError('S3 storage not yet implemented', 501);
  }

  async delete(_filepath: string): Promise<void> {
    // TODO: Implement S3 delete
    throw new AppError('S3 storage not yet implemented', 501);
  }

  getUrl(_filepath: string): string {
    // TODO: Return S3 URL
    return '';
  }
}

// Default storage instance
export const storage: StorageStrategy = new LocalStorageStrategy();

/**
 * Express middleware for handling file uploads via raw body parsing
 * For production use with multer, install and configure multer separately
 */
export function validateUpload(
  allowedTypes: string[] = [...UPLOAD_CONFIG.ALLOWED_MIME_TYPES],
  maxSize: number = UPLOAD_CONFIG.MAX_FILE_SIZE
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
      next(new AppError('Content-Type must be multipart/form-data', 400));
      return;
    }

    // File validation will be handled by multer in the upload module
    // This middleware serves as a pre-check
    next();
  };
}
