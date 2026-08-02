import { Response } from 'express';
import { UploadsService } from './uploads.service.js';
import { sendSuccess } from '../../utils/index.js';
import type { AuthenticatedRequest } from '../../middleware/auth.js';

export class UploadsController {
  static async uploadFile(req: AuthenticatedRequest, res: Response): Promise<void> {
    const file = req.file;
    const userId = req.user!.id;

    const result = await UploadsService.saveUpload(file!, userId);

    sendSuccess(res, result, 'File uploaded successfully', 201);
  }

  static async getUserUploads(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const uploads = await UploadsService.getUserUploads(userId);

    sendSuccess(res, uploads, 'User uploads fetched successfully');
  }
}
