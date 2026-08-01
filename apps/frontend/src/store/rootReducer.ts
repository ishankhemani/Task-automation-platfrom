import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  // Reducers will be attached here during business logic implementation
});

export type RootState = ReturnType<typeof rootReducer>;
