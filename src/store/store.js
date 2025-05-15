import { configureStore } from '@reduxjs/toolkit';
import credentialReducer from './credentialSlice';

export const store = configureStore({
  reducer: {
    credentials: credentialReducer,
  },
});