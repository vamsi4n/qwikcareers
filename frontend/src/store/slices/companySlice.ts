import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  Company,
  CompanyState,
  ApiResponse,
  RootState
} from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Query params interface
interface CompanyQueryParams {
  search?: string;
  industry?: string;
  size?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

const initialState: CompanyState = {
  companies: [],
  company: null,
  followedCompanies: [],
  isLoading: false,
  error: null,
};

// Get companies
export const getCompanies = createAsyncThunk<
  Company[],
  CompanyQueryParams | void,
  { rejectValue: string }
>(
  'companies/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<Company[]>>(
        `${API_URL}/companies`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get companies';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get company by ID
export const getCompanyById = createAsyncThunk<
  Company,
  string,
  { rejectValue: string }
>(
  'companies/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get<ApiResponse<Company>>(
        `${API_URL}/companies/${id}`
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to get company';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get followed companies
export const getFollowedCompanies = createAsyncThunk<
  Company[],
  void,
  { state: RootState; rejectValue: string }
>(
  'companies/getFollowed',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<Company[]>>(
        `${API_URL}/companies/followed`,
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
        'Failed to get followed companies';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Follow company
export const followCompany = createAsyncThunk<
  Company,
  string,
  { state: RootState; rejectValue: string }
>(
  'companies/follow',
  async (companyId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post<ApiResponse<Company>>(
        `${API_URL}/companies/${companyId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to follow company';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Unfollow company
export const unfollowCompany = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>(
  'companies/unfollow',
  async (companyId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      await axios.post(
        `${API_URL}/companies/${companyId}/unfollow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return companyId;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to unfollow company';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    resetCompanyState: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    clearCompany: (state) => {
      state.company = null;
    },
    clearCompanies: (state) => {
      state.companies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload;
        state.error = null;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get companies';
      })
      .addCase(getCompanyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get company';
      })
      .addCase(getFollowedCompanies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFollowedCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followedCompanies = action.payload;
        state.error = null;
      })
      .addCase(getFollowedCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get followed companies';
      })
      .addCase(followCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(followCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followedCompanies.push(action.payload);
        state.error = null;
      })
      .addCase(followCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to follow company';
      })
      .addCase(unfollowCompany.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unfollowCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.followedCompanies = state.followedCompanies.filter(
          (company) => company._id !== action.payload
        );
        state.error = null;
      })
      .addCase(unfollowCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to unfollow company';
      });
  },
});

export const { resetCompanyState, clearCompany, clearCompanies } = companySlice.actions;
export default companySlice.reducer;
