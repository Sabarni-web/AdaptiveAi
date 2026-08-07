import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import examReducer from './slices/examSlice';
import proctoringReducer from './slices/proctoringSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    exam: examReducer,
    proctoring: proctoringReducer,
  },
});
