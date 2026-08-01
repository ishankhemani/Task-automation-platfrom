import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/index.js';
import { setCredentials, setAuthLoading, logout } from '../store/slices/authSlice.js';
import { axiosClient } from '../api/axiosClient.js';
import { ApiResponse, User } from '../types/index.js';

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      dispatch(setAuthLoading(true));
      try {
        // Attempt to fetch current authenticated user profile using refresh token / session cookie
        const response = await axiosClient.get<unknown, ApiResponse<User>>('/auth/me');
        if (response.success && response.data) {
          // If profile returned, restore session
          dispatch(
            setCredentials({
              user: response.data,
              accessToken: '', // Token will be refreshed on demand by Axios interceptor
            })
          );
        } else {
          dispatch(logout());
        }
      } catch {
        // Silent failure if user is not authenticated on boot
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  return <>{children}</>;
}
