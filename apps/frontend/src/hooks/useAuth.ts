import { useAppDispatch, useAppSelector } from '../store/index.js';
import {
  setCredentials,
  updateAccessToken,
  updateUser,
  setAuthLoading,
  setAuthError,
  logout as logoutAction,
} from '../store/slices/authSlice.js';
import { User } from '../types/index.js';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, accessToken, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const login = (userData: User, token: string) => {
    dispatch(setCredentials({ user: userData, accessToken: token }));
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const updateToken = (newToken: string) => {
    dispatch(updateAccessToken(newToken));
  };

  const updateProfile = (updatedUser: User) => {
    dispatch(updateUser(updatedUser));
  };

  const setLoading = (loading: boolean) => {
    dispatch(setAuthLoading(loading));
  };

  const setError = (err: string | null) => {
    dispatch(setAuthError(err));
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    error,
    role: user?.role,
    login,
    logout,
    updateToken,
    updateProfile,
    setLoading,
    setError,
  };
}
