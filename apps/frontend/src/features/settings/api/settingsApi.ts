import { axiosClient } from '../../../api/axiosClient.js';
import { ApiResponse } from '../../../types/index.js';

export const settingsApi = {
  getSettings: () =>
    axiosClient.get<unknown, ApiResponse<unknown>>('/settings'),
};
