import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/shared/utils/api/axios.config';
import { AxiosError } from 'axios';
import { User, ApiResponse } from '../../types';

// Admin-specific interfaces
export interface ModerationItem {
  _id: string;
  contentType: 'job' | 'profile' | 'application' | 'company' | 'message';
  contentId: string;
  reportedBy: User | string;
  reason: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'removed';
  resolution?: string;
  resolvedBy?: User | string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface AdminState {
  // User Management
  users: User[];
  selectedUser: User | null;
  usersLoading: boolean;
  usersPagination: PaginationInfo | null;

  // Content Moderation
  moderationQueue: ModerationItem[];
  selectedModerationItem: ModerationItem | null;
  moderationLoading: boolean;
  moderationPagination: PaginationInfo | null;

  // Analytics
  platformAnalytics: any | null;
  userAnalytics: any | null;
  jobAnalytics: any | null;
  recentActivity: any | null;
  analyticsLoading: boolean;
  analyticsPeriod: '7days' | '30days' | '90days' | 'all';

  // Settings
  systemSettings: any | null;
  settingsLoading: boolean;

  // Audit Logs
  auditLogs: any[];
  auditLogsLoading: boolean;
  auditLogsPagination: PaginationInfo | null;

  // Global
  error: string | null;
}

// Request parameter interfaces
export interface FetchUsersParams {
  page?: number;
  limit?: number;
  role?: 'jobseeker' | 'employer' | 'admin';
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateUserStatusParams {
  userId: string;
  status: 'active' | 'suspended' | 'banned';
}

export interface FetchModerationQueueParams {
  page?: number;
  limit?: number;
  contentType?: 'job' | 'profile' | 'application' | 'company' | 'message';
  status?: 'pending' | 'under_review' | 'approved' | 'rejected' | 'removed';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  search?: string;
}

export interface ModerationResolution {
  reportId: string;
  resolution: string;
}

export interface CreateModerationReportParams {
  contentType: 'job' | 'profile' | 'application' | 'company' | 'message';
  contentId: string;
  reason: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface FetchAnalyticsParams {
  period: '7days' | '30days' | '90days' | 'all';
}

export interface FetchAuditLogsParams {
  page?: number;
  limit?: number;
  adminId?: string;
  action?: string;
  targetType?: string;
  startDate?: string;
  endDate?: string;
}

// Response interfaces
interface PaginatedResponse<T> {
  results: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const initialState: AdminState = {
  users: [],
  selectedUser: null,
  usersLoading: false,
  usersPagination: null,

  moderationQueue: [],
  selectedModerationItem: null,
  moderationLoading: false,
  moderationPagination: null,

  platformAnalytics: null,
  userAnalytics: null,
  jobAnalytics: null,
  recentActivity: null,
  analyticsLoading: false,
  analyticsPeriod: '30days',

  systemSettings: null,
  settingsLoading: false,

  auditLogs: [],
  auditLogsLoading: false,
  auditLogsPagination: null,

  error: null,
};

// ==================== USER MANAGEMENT ASYNC THUNKS ====================

export const fetchUsers = createAsyncThunk<
  PaginatedResponse<User>,
  FetchUsersParams | undefined,
  { rejectValue: string }
>(
  'admin/fetchUsers',
  async (params = {}, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<User>>>(
        '/admin/users',
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch users';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserById = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>(
  'admin/fetchUserById',
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<User>>(
        `/admin/users/${userId}`
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserStatus = createAsyncThunk<
  User,
  UpdateUserStatusParams,
  { rejectValue: string }
>(
  'admin/updateUserStatus',
  async ({ userId, status }, thunkAPI) => {
    try {
      const response = await axios.patch<ApiResponse<User>>(
        `/admin/users/${userId}/status`,
        { status }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to update user status';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'admin/deleteUser',
  async (userId, thunkAPI) => {
    try {
      await axios.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to delete user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== CONTENT MODERATION ASYNC THUNKS ====================

export const fetchModerationQueue = createAsyncThunk<
  PaginatedResponse<ModerationItem>,
  FetchModerationQueueParams | undefined,
  { rejectValue: string }
>(
  'admin/fetchModerationQueue',
  async (params = {}, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<ModerationItem>>>(
        '/admin/moderation',
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch moderation queue';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchModerationItemById = createAsyncThunk<
  ModerationItem,
  string,
  { rejectValue: string }
>(
  'admin/fetchModerationItemById',
  async (reportId, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<ModerationItem>>(
        `/admin/moderation/${reportId}`
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch moderation item';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveContent = createAsyncThunk<
  ModerationItem,
  ModerationResolution,
  { rejectValue: string }
>(
  'admin/approveContent',
  async ({ reportId, resolution }, thunkAPI) => {
    try {
      const response = await axios.post<ApiResponse<ModerationItem>>(
        `/admin/moderation/${reportId}/approve`,
        { resolution }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to approve content';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rejectReport = createAsyncThunk<
  ModerationItem,
  ModerationResolution,
  { rejectValue: string }
>(
  'admin/rejectReport',
  async ({ reportId, resolution }, thunkAPI) => {
    try {
      const response = await axios.post<ApiResponse<ModerationItem>>(
        `/admin/moderation/${reportId}/reject`,
        { resolution }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to reject report';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeContent = createAsyncThunk<
  ModerationItem,
  ModerationResolution,
  { rejectValue: string }
>(
  'admin/removeContent',
  async ({ reportId, resolution }, thunkAPI) => {
    try {
      const response = await axios.post<ApiResponse<ModerationItem>>(
        `/admin/moderation/${reportId}/remove`,
        { resolution }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to remove content';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createModerationReport = createAsyncThunk<
  ModerationItem,
  CreateModerationReportParams,
  { rejectValue: string }
>(
  'admin/createModerationReport',
  async (reportData, thunkAPI) => {
    try {
      const response = await axios.post<ApiResponse<ModerationItem>>(
        '/admin/moderation',
        reportData
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to create moderation report';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== ANALYTICS ASYNC THUNKS ====================

export const fetchPlatformAnalytics = createAsyncThunk<
  any,
  FetchAnalyticsParams | undefined,
  { rejectValue: string }
>(
  'admin/fetchPlatformAnalytics',
  async (params = { period: '30days' }, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<any>>(
        '/admin/analytics/platform',
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch platform analytics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchUserAnalytics = createAsyncThunk<
  any,
  FetchAnalyticsParams | undefined,
  { rejectValue: string }
>(
  'admin/fetchUserAnalytics',
  async (params = { period: '30days' }, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<any>>(
        '/admin/analytics/users',
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch user analytics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchJobAnalytics = createAsyncThunk<
  any,
  FetchAnalyticsParams | undefined,
  { rejectValue: string }
>(
  'admin/fetchJobAnalytics',
  async (params = { period: '30days' }, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<any>>(
        '/admin/analytics/jobs',
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch job analytics';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchRecentActivity = createAsyncThunk<
  any,
  { limit?: number } | undefined,
  { rejectValue: string }
>(
  'admin/fetchRecentActivity',
  async (params = { limit: 10 }, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<any>>(
        '/admin/analytics/activity',
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch recent activity';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== SETTINGS ASYNC THUNKS ====================

export const fetchSystemSettings = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>(
  'admin/fetchSystemSettings',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<any>>('/admin/settings');
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch system settings';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateSystemSettings = createAsyncThunk<
  any,
  any,
  { rejectValue: string }
>(
  'admin/updateSystemSettings',
  async (settings, thunkAPI) => {
    try {
      const response = await axios.put<ApiResponse<any>>(
        '/admin/settings',
        settings
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to update system settings';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetSystemSettings = createAsyncThunk<
  any,
  void,
  { rejectValue: string }
>(
  'admin/resetSystemSettings',
  async (_, thunkAPI) => {
    try {
      const response = await axios.post<ApiResponse<any>>(
        '/admin/settings/reset'
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to reset system settings';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== AUDIT LOGS ASYNC THUNKS ====================

export const fetchAuditLogs = createAsyncThunk<
  PaginatedResponse<any>,
  FetchAuditLogsParams | undefined,
  { rejectValue: string }
>(
  'admin/fetchAuditLogs',
  async (params = {}, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<any>>>(
        '/admin/audit-logs',
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to fetch audit logs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ==================== ADMIN SLICE ====================

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Helper reducer to change analytics period
    setAnalyticsPeriod: (state, action: PayloadAction<'7days' | '30days' | '90days' | 'all'>) => {
      state.analyticsPeriod = action.payload;
    },

    // Helper reducer to clear error state
    clearError: (state) => {
      state.error = null;
    },

    // Clear selected user
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },

    // Clear selected moderation item
    clearSelectedModerationItem: (state) => {
      state.selectedModerationItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== USER MANAGEMENT ====================
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.results;
        state.usersPagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
          limit: action.payload.limit,
        };
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      })

      // Fetch User By ID
      .addCase(fetchUserById.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload || 'Failed to fetch user';
      })

      // Update User Status
      .addCase(updateUserStatus.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Update user in the list
        const index = state.users.findIndex(user => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        // Update selected user if it's the same
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload || 'Failed to update user status';
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersLoading = false;
        // Remove user from the list
        state.users = state.users.filter(user => user._id !== action.payload);
        // Clear selected user if it's the deleted one
        if (state.selectedUser?._id === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload || 'Failed to delete user';
      })

      // ==================== CONTENT MODERATION ====================
      // Fetch Moderation Queue
      .addCase(fetchModerationQueue.pending, (state) => {
        state.moderationLoading = true;
        state.error = null;
      })
      .addCase(fetchModerationQueue.fulfilled, (state, action) => {
        state.moderationLoading = false;
        state.moderationQueue = action.payload.results;
        state.moderationPagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
          limit: action.payload.limit,
        };
        state.error = null;
      })
      .addCase(fetchModerationQueue.rejected, (state, action) => {
        state.moderationLoading = false;
        state.error = action.payload || 'Failed to fetch moderation queue';
      })

      // Fetch Moderation Item By ID
      .addCase(fetchModerationItemById.pending, (state) => {
        state.moderationLoading = true;
        state.error = null;
      })
      .addCase(fetchModerationItemById.fulfilled, (state, action) => {
        state.moderationLoading = false;
        state.selectedModerationItem = action.payload;
        state.error = null;
      })
      .addCase(fetchModerationItemById.rejected, (state, action) => {
        state.moderationLoading = false;
        state.error = action.payload || 'Failed to fetch moderation item';
      })

      // Approve Content
      .addCase(approveContent.pending, (state) => {
        state.moderationLoading = true;
        state.error = null;
      })
      .addCase(approveContent.fulfilled, (state, action) => {
        state.moderationLoading = false;
        // Update item in the queue
        const index = state.moderationQueue.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.moderationQueue[index] = action.payload;
        }
        // Update selected item if it's the same
        if (state.selectedModerationItem?._id === action.payload._id) {
          state.selectedModerationItem = action.payload;
        }
        state.error = null;
      })
      .addCase(approveContent.rejected, (state, action) => {
        state.moderationLoading = false;
        state.error = action.payload || 'Failed to approve content';
      })

      // Reject Report
      .addCase(rejectReport.pending, (state) => {
        state.moderationLoading = true;
        state.error = null;
      })
      .addCase(rejectReport.fulfilled, (state, action) => {
        state.moderationLoading = false;
        // Update item in the queue
        const index = state.moderationQueue.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.moderationQueue[index] = action.payload;
        }
        // Update selected item if it's the same
        if (state.selectedModerationItem?._id === action.payload._id) {
          state.selectedModerationItem = action.payload;
        }
        state.error = null;
      })
      .addCase(rejectReport.rejected, (state, action) => {
        state.moderationLoading = false;
        state.error = action.payload || 'Failed to reject report';
      })

      // Remove Content
      .addCase(removeContent.pending, (state) => {
        state.moderationLoading = true;
        state.error = null;
      })
      .addCase(removeContent.fulfilled, (state, action) => {
        state.moderationLoading = false;
        // Update item in the queue
        const index = state.moderationQueue.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.moderationQueue[index] = action.payload;
        }
        // Update selected item if it's the same
        if (state.selectedModerationItem?._id === action.payload._id) {
          state.selectedModerationItem = action.payload;
        }
        state.error = null;
      })
      .addCase(removeContent.rejected, (state, action) => {
        state.moderationLoading = false;
        state.error = action.payload || 'Failed to remove content';
      })

      // Create Moderation Report
      .addCase(createModerationReport.pending, (state) => {
        state.moderationLoading = true;
        state.error = null;
      })
      .addCase(createModerationReport.fulfilled, (state, action) => {
        state.moderationLoading = false;
        state.moderationQueue.unshift(action.payload); // Add to beginning of queue
        state.error = null;
      })
      .addCase(createModerationReport.rejected, (state, action) => {
        state.moderationLoading = false;
        state.error = action.payload || 'Failed to create moderation report';
      })

      // ==================== ANALYTICS ====================
      // Fetch Platform Analytics
      .addCase(fetchPlatformAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchPlatformAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.platformAnalytics = action.payload;
        state.error = null;
      })
      .addCase(fetchPlatformAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload || 'Failed to fetch platform analytics';
      })

      // Fetch User Analytics
      .addCase(fetchUserAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.userAnalytics = action.payload;
        state.error = null;
      })
      .addCase(fetchUserAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload || 'Failed to fetch user analytics';
      })

      // Fetch Job Analytics
      .addCase(fetchJobAnalytics.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchJobAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.jobAnalytics = action.payload;
        state.error = null;
      })
      .addCase(fetchJobAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload || 'Failed to fetch job analytics';
      })

      // Fetch Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.analyticsLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.recentActivity = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload || 'Failed to fetch recent activity';
      })

      // ==================== SETTINGS ====================
      // Fetch System Settings
      .addCase(fetchSystemSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(fetchSystemSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.systemSettings = action.payload;
        state.error = null;
      })
      .addCase(fetchSystemSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload || 'Failed to fetch system settings';
      })

      // Update System Settings
      .addCase(updateSystemSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(updateSystemSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.systemSettings = action.payload;
        state.error = null;
      })
      .addCase(updateSystemSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload || 'Failed to update system settings';
      })

      // Reset System Settings
      .addCase(resetSystemSettings.pending, (state) => {
        state.settingsLoading = true;
        state.error = null;
      })
      .addCase(resetSystemSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.systemSettings = action.payload;
        state.error = null;
      })
      .addCase(resetSystemSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload || 'Failed to reset system settings';
      })

      // ==================== AUDIT LOGS ====================
      // Fetch Audit Logs
      .addCase(fetchAuditLogs.pending, (state) => {
        state.auditLogsLoading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogsLoading = false;
        state.auditLogs = action.payload.results;
        state.auditLogsPagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
          limit: action.payload.limit,
        };
        state.error = null;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.auditLogsLoading = false;
        state.error = action.payload || 'Failed to fetch audit logs';
      });
  },
});

// ==================== EXPORTS ====================

// Export actions
export const {
  setAnalyticsPeriod,
  clearError,
  clearSelectedUser,
  clearSelectedModerationItem,
} = adminSlice.actions;

// Export selectors
export const selectUsers = (state: { admin: AdminState }) => state.admin.users;
export const selectSelectedUser = (state: { admin: AdminState }) => state.admin.selectedUser;
export const selectUsersLoading = (state: { admin: AdminState }) => state.admin.usersLoading;
export const selectUsersPagination = (state: { admin: AdminState }) => state.admin.usersPagination;

export const selectModerationQueue = (state: { admin: AdminState }) => state.admin.moderationQueue;
export const selectSelectedModerationItem = (state: { admin: AdminState }) => state.admin.selectedModerationItem;
export const selectModerationLoading = (state: { admin: AdminState }) => state.admin.moderationLoading;
export const selectModerationPagination = (state: { admin: AdminState }) => state.admin.moderationPagination;

export const selectPlatformAnalytics = (state: { admin: AdminState }) => state.admin.platformAnalytics;
export const selectUserAnalytics = (state: { admin: AdminState }) => state.admin.userAnalytics;
export const selectJobAnalytics = (state: { admin: AdminState }) => state.admin.jobAnalytics;
export const selectRecentActivity = (state: { admin: AdminState }) => state.admin.recentActivity;
export const selectAnalyticsLoading = (state: { admin: AdminState }) => state.admin.analyticsLoading;
export const selectAnalyticsPeriod = (state: { admin: AdminState }) => state.admin.analyticsPeriod;

export const selectSystemSettings = (state: { admin: AdminState }) => state.admin.systemSettings;
export const selectSettingsLoading = (state: { admin: AdminState }) => state.admin.settingsLoading;

export const selectAuditLogs = (state: { admin: AdminState }) => state.admin.auditLogs;
export const selectAuditLogsLoading = (state: { admin: AdminState }) => state.admin.auditLogsLoading;
export const selectAuditLogsPagination = (state: { admin: AdminState }) => state.admin.auditLogsPagination;

export const selectAdminError = (state: { admin: AdminState }) => state.admin.error;

// Export reducer as default
export default adminSlice.reducer;
