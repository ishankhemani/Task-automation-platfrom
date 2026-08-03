import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { UploadsController } from './uploads.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/index.js';
import { AppError } from '../../errors/index.js';

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    cb(null, filename);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const ext = path.extname(file.originalname || '').toLowerCase();

  const isImageMime = mime.startsWith('image/');
  const isPdfMime = mime === 'application/pdf';
  const isAllowedExt = /\.(jpe?g|png|gif|webp|pdf|svg|bmp|tiff|avif)$/i.test(ext);

  if (isImageMime || isPdfMime || isAllowedExt) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only Images (JPEG, JPG, PNG, GIF, WEBP, SVG) and PDFs are allowed.', 400));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

const router = Router();

router.use(authenticate);

router.post('/', upload.single('file'), asyncHandler(UploadsController.uploadFile));
router.get('/', asyncHandler(UploadsController.getUserUploads));

export default router;
