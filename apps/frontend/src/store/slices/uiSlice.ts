import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../config/constants.js';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  activeModal: string | null;
  notificationDrawerOpen: boolean;
}

const getInitialSidebarState = (): boolean => {
  const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
  return saved ? JSON.parse(saved) : false;
};

const initialState: UIState = {
  sidebarCollapsed: getInitialSidebarState(),
  theme: 'dark',
  activeModal: null,
  notificationDrawerOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(state.sidebarCollapsed));
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, JSON.stringify(action.payload));
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    toggleNotificationDrawer: (state) => {
      state.notificationDrawerOpen = !state.notificationDrawerOpen;
    },
    setNotificationDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationDrawerOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  openModal,
  closeModal,
  toggleNotificationDrawer,
  setNotificationDrawerOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
