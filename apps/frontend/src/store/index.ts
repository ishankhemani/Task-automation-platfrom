import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import socketReducer from './slices/socketSlice.js';
import { setAxiosStoreRef } from '../api/axiosClient.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Pass store reference to Axios client for state access & token dispatching
setAxiosStoreRef(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
