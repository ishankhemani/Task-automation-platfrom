import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '../config/env.js';
import { ApiResponse } from '../types/index.js';

let storeRef: { getState: () => { auth: { accessToken: string | null } }; dispatch: (action: unknown) => void } | null = null;

export const setAxiosStoreRef = (store: typeof storeRef) => {
  storeRef = store;
};

export const axiosClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Mutex queue variables to handle concurrent 401 token refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token from Redux store memory
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (storeRef) {
      const accessToken = storeRef.getState().auth.accessToken;
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Unpack data envelope & Handle 401 token refresh queue
axiosClient.interceptors.response.use(
  (response) => {
    // Unpack standard backend response payload { success, data, message, timestamp }
    return response.data;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Avoid looping if the failing request is itself the refresh-token endpoint
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        if (storeRef) {
          storeRef.dispatch({ type: 'auth/logout' });
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue parallel requests while refresh is in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Execute refresh token request
        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${env.VITE_API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;

        if (newAccessToken && storeRef) {
          storeRef.dispatch({
            type: 'auth/updateAccessToken',
            payload: newAccessToken,
          });

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          processQueue(null, newAccessToken);
          return axiosClient(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshErr) {
        processQueue(refreshErr as AxiosError, null);
        if (storeRef) {
          storeRef.dispatch({ type: 'auth/logout' });
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
