import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  isConnected: boolean;
  activeRooms: string[];
}

const initialState: SocketState = {
  isConnected: false,
  activeRooms: [],
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    addRoom: (state, action: PayloadAction<string>) => {
      if (!state.activeRooms.includes(action.payload)) {
        state.activeRooms.push(action.payload);
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      state.activeRooms = state.activeRooms.filter((room) => room !== action.payload);
    },
    clearRooms: (state) => {
      state.activeRooms = [];
    },
  },
});

export const { setSocketConnected, addRoom, removeRoom, clearRooms } = socketSlice.actions;

export default socketSlice.reducer;
