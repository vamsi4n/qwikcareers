import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  Job,
  JobState,
  PaginatedResponse,
  ApiResponse,
  RootState
} from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Search params interface
interface JobSearchParams {
  keyword?: string;
  location?: string;
  jobType?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

// Saved job interface
interface SavedJob {
  _id: string;
  job: Job;
  user: string;
  createdAt: string;
}

// Job alert interface
interface JobAlert {
  _id: string;
  user: string;
  keyword: string;
  location?: string;
  jobType?: string;
  frequency: 'daily' | 'weekly';
  isActive: boolean;
  createdAt: string;
}

const initialState: JobState = {
  jobs: [],
  job: null,
  savedJobs: [],
  jobAlerts: [],
  recommendedJobs: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

// Search jobs
export const searchJobs = createAsyncThunk<
  PaginatedResponse<Job>,
  JobSearchParams,
  { rejectValue: string }
>(
  'jobs/search',
  async (params, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<PaginatedResponse<Job>>>(
        `${API_URL}/jobs`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to search jobs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job by ID
export const getJobById = createAsyncThunk<
  Job,
  string,
  { rejectValue: string }
>(
  'jobs/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<Job>>(
        `${API_URL}/jobs/${id}`
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get saved jobs
export const getSavedJobs = createAsyncThunk<
  SavedJob[],
  void,
  { state: RootState; rejectValue: string }
>(
  'jobs/getSaved',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<SavedJob[]>>(
        `${API_URL}/saved-jobs`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get saved jobs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save job
export const saveJob = createAsyncThunk<
  SavedJob,
  string,
  { state: RootState; rejectValue: string }
>(
  'jobs/save',
  async (jobId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post<ApiResponse<SavedJob>>(
        `${API_URL}/saved-jobs`,
        { job: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to save job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job alerts
export const getJobAlerts = createAsyncThunk<
  JobAlert[],
  void,
  { state: RootState; rejectValue: string }
>(
  'jobs/getAlerts',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<JobAlert[]>>(
        `${API_URL}/job-alerts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get job alerts';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get recommended jobs
export const getRecommendedJobs = createAsyncThunk<
  Job[],
  void,
  { state: RootState; rejectValue: string }
>(
  'jobs/getRecommended',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<Job[]>>(
        `${API_URL}/jobs/recommended`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get recommended jobs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    resetJobState: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    clearJob: (state) => {
      state.job = null;
    },
    clearJobs: (state) => {
      state.jobs = [];
      state.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Search jobs
      .addCase(searchJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobs = action.payload.results;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
        state.error = null;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to search jobs';
      })
      // Get job by ID
      .addCase(getJobById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.job = action.payload;
        state.error = null;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get job';
      })
      // Get saved jobs
      .addCase(getSavedJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedJobs = action.payload;
        state.error = null;
      })
      .addCase(getSavedJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get saved jobs';
      })
      // Save job
      .addCase(saveJob.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedJobs.push(action.payload);
        state.error = null;
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to save job';
      })
      // Get job alerts
      .addCase(getJobAlerts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getJobAlerts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobAlerts = action.payload;
        state.error = null;
      })
      .addCase(getJobAlerts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get job alerts';
      })
      // Get recommended jobs
      .addCase(getRecommendedJobs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendedJobs = action.payload;
        state.error = null;
      })
      .addCase(getRecommendedJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get recommended jobs';
      });
  },
});

export const { resetJobState, clearJob, clearJobs } = jobSlice.actions;
export default jobSlice.reducer;
