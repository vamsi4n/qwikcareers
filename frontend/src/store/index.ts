import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../types';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import companyReducer from './slices/companySlice';
import notificationReducer from './slices/notificationSlice';
import messageReducer from './slices/messageSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    companies: companyReducer,
    notifications: notificationReducer,
    messages: messageReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Export types
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
