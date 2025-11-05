import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  Notification,
  NotificationState,
  ApiResponse,
  RootState
} from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Query params interface
interface NotificationQueryParams {
  read?: boolean;
  type?: string;
  limit?: number;
  page?: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Get notifications
export const getNotifications = createAsyncThunk<
  Notification[],
  NotificationQueryParams | void,
  { state: RootState; rejectValue: string }
>(
  'notifications/getAll',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<Notification[]>>(
        `${API_URL}/notifications`,
        {
          params,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get notifications';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get unread count
export const getUnreadCount = createAsyncThunk<
  number,
  void,
  { state: RootState; rejectValue: string }
>(
  'notifications/getUnreadCount',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<{ count: number }>>(
        `${API_URL}/notifications/unread-count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data.count;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get unread count';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark as read
export const markAsRead = createAsyncThunk<
  Notification,
  string,
  { state: RootState; rejectValue: string }
>(
  'notifications/markAsRead',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post<ApiResponse<Notification>>(
        `${API_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to mark notification as read';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark all as read
export const markAllAsRead = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>(
  'notifications/markAllAsRead',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.post(
        `${API_URL}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to mark all notifications as read';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.error = null;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get notifications';
      })
      .addCase(getUnreadCount.pending, (state) => {
        state.error = null;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
        state.error = null;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.error = action.payload || 'Failed to get unread count';
      })
      .addCase(markAsRead.pending, (state) => {
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.error = null;
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload || 'Failed to mark notification as read';
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.isLoading = false;
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
        state.error = null;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to mark all notifications as read';
      });
  },
});

export const { resetNotificationState, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
