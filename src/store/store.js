import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import credentialsReducer from './credentialSlice';
import worksheetsReducer from './worksheetsSlice';

export const store = configureStore({
  reducer: {
    credentials: persistReducer({ key: 'credentials', storage }, credentialsReducer),
    worksheets: persistReducer({ key: 'worksheets', storage }, worksheetsReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'] },
    }),
});

export const persistor = persistStore(store);