import { prisma } from '../../database/index.js';

export class UploadsRepository {
  static async createUpload(data: {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    userId: string;
  }) {
    return prisma.upload.create({
      data,
    });
  }

  static async findUploadById(id: string) {
    return prisma.upload.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async findUploadsByUser(userId: string) {
    return prisma.upload.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }
}
