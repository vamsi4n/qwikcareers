import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  Application,
  ApplicationState,
  ApiResponse,
  RootState
} from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Application submission data interface
interface ApplicationSubmitData {
  job: string;
  coverLetter?: string;
  resume?: string;
  answers?: Array<{
    question: string;
    answer: string;
  }>;
}

// Query params interface
interface ApplicationQueryParams {
  status?: string;
  limit?: number;
  page?: number;
}

const initialState: ApplicationState = {
  applications: [],
  application: null,
  isLoading: false,
  error: null,
};

// Get user applications
export const getMyApplications = createAsyncThunk<
  Application[],
  ApplicationQueryParams | void,
  { state: RootState; rejectValue: string }
>(
  'applications/getMy',
  async (params, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<Application[]>>(
        `${API_URL}/applications/my`,
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
        'Failed to get applications';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get application by ID
export const getApplicationById = createAsyncThunk<
  Application,
  string,
  { state: RootState; rejectValue: string }
>(
  'applications/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<Application>>(
        `${API_URL}/applications/${id}`,
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
        'Failed to get application';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Submit application
export const submitApplication = createAsyncThunk<
  Application,
  ApplicationSubmitData,
  { state: RootState; rejectValue: string }
>(
  'applications/submit',
  async (applicationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post<ApiResponse<Application>>(
        `${API_URL}/applications`,
        applicationData,
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
        'Failed to submit application';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Withdraw application
export const withdrawApplication = createAsyncThunk<
  Application,
  string,
  { state: RootState; rejectValue: string }
>(
  'applications/withdraw',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post<ApiResponse<Application>>(
        `${API_URL}/applications/${id}/withdraw`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to withdraw application';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    resetApplicationState: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    clearApplication: (state) => {
      state.application = null;
    },
    clearApplications: (state) => {
      state.applications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
        state.error = null;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get applications';
      })
      .addCase(getApplicationById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getApplicationById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.application = action.payload;
        state.error = null;
      })
      .addCase(getApplicationById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get application';
      })
      .addCase(submitApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload);
        state.error = null;
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to submit application';
      })
      .addCase(withdrawApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.applications.findIndex((app) => app._id === action.payload._id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to withdraw application';
      });
  },
});

export const { resetApplicationState, clearApplication, clearApplications } = applicationSlice.actions;
export default applicationSlice.reducer;
