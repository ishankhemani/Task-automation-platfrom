import { axiosClient } from './axiosClient.js';
import { ApiResponse } from '../types/index.js';

export interface UploadResult {
  upload: {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    userId: string;
    createdAt: string;
  };
  url: string;
}

export const uploadsApi = {
  uploadFile: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosClient.post<unknown, ApiResponse<UploadResult>>('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
  },

  getUserUploads: () =>
    axiosClient.get<unknown, ApiResponse<UploadResult['upload'][]>>('/uploads'),
};
