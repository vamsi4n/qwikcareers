import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const initialState = {
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
  isError: false,
  message: '',
};

// Search jobs
export const searchJobs = createAsyncThunk(
  'jobs/search',
  async (params, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/jobs`, { params });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job by ID
export const getJobById = createAsyncThunk(
  'jobs/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/jobs/${id}`);
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get saved jobs
export const getSavedJobs = createAsyncThunk(
  'jobs/getSaved',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.get(`${API_URL}/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save job
export const saveJob = createAsyncThunk(
  'jobs/save',
  async (jobId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.post(
        `${API_URL}/saved-jobs`,
        { job: jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get job alerts
export const getJobAlerts = createAsyncThunk(
  'jobs/getAlerts',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.get(`${API_URL}/job-alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get recommended jobs
export const getRecommendedJobs = createAsyncThunk(
  'jobs/getRecommended',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.get(`${API_URL}/jobs/recommended`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    clearJob: (state) => {
      state.job = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search jobs
      .addCase(searchJobs.pending, (state) => {
        state.isLoading = true;
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
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get job by ID
      .addCase(getJobById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.job = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get saved jobs
      .addCase(getSavedJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedJobs = action.payload;
      })
      .addCase(getSavedJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Save job
      .addCase(saveJob.fulfilled, (state, action) => {
        state.savedJobs.push(action.payload);
      })
      // Get job alerts
      .addCase(getJobAlerts.fulfilled, (state, action) => {
        state.jobAlerts = action.payload;
      })
      // Get recommended jobs
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.recommendedJobs = action.payload;
      });
  },
});

export const { reset, clearJob } = jobSlice.actions;
export default jobSlice.reducer;
