import { UploadsRepository } from './uploads.repository.js';
import { BadRequestError } from '../../errors/index.js';
import { logger } from '../../utils/index.js';

export class UploadsService {
  static async saveUpload(
    file: Express.Multer.File,
    userId: string
  ) {
    if (!file) {
      throw new BadRequestError('No file provided for upload');
    }

    const publicUrl = `/uploads/${file.filename}`;

    const upload = await UploadsRepository.createUpload({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      userId,
    });

    logger.info({ uploadId: upload.id, userId, filename: file.filename }, 'File metadata saved');

    return {
      upload,
      url: publicUrl,
    };
  }

  static async getUserUploads(userId: string) {
    return UploadsRepository.findUploadsByUser(userId);
  }
}
