import React, { useEffect } from 'react';
import axios from 'axios';
import { useAppDispatch } from '../store/index.js';
import { setCredentials, setAuthLoading, logout } from '../store/slices/authSlice.js';
import { ApiResponse, User } from '../types/index.js';
import { env } from '../config/env.js';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      dispatch(setAuthLoading(true));

      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        dispatch(logout());
        dispatch(setAuthLoading(false));
        return;
      }

      try {
        // 1. Obtain a fresh access token using the stored refresh token
        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${env.VITE_API_BASE_URL}/auth/refresh-token`,
          { refreshToken: storedRefreshToken },
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        if (newAccessToken) {
          // 2. Fetch current user profile with the valid access token
          const profileResponse = await axios.get<ApiResponse<User>>(
            `${env.VITE_API_BASE_URL}/auth/me`,
            {
              headers: { Authorization: `Bearer ${newAccessToken}` },
              withCredentials: true,
            }
          );

          if (profileResponse.data?.success && profileResponse.data?.data) {
            // Restore Redux state with user profile AND active accessToken
            dispatch(
              setCredentials({
                user: profileResponse.data.data,
                accessToken: newAccessToken,
              })
            );
            dispatch(setAuthLoading(false));
            return;
          }
        }

        // Refresh succeeded but no token returned — clear session
        localStorage.removeItem('refreshToken');
        dispatch(logout());
      } catch (err: unknown) {
        // Only clear the stored refreshToken if the server explicitly
        // rejected it (401 / 403). For network errors (e.g. backend not
        // yet started, offline), keep the token so the user isn't
        // logged out just because the backend was temporarily unreachable.
        const status = (err as { response?: { status?: number } })?.response?.status;
        const isAuthError = status === 401 || status === 403;

        if (isAuthError) {
          localStorage.removeItem('refreshToken');
          dispatch(logout());
        } else {
          // Network / timeout error — don't wipe session; just mark as
          // not authenticated for now. The interceptor will handle re-auth.
          dispatch(logout());
        }
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  return <>{children}</>;
}
