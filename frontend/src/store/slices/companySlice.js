import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const initialState = {
  companies: [],
  company: null,
  followedCompanies: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get companies
export const getCompanies = createAsyncThunk(
  'companies/getAll',
  async (params, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/companies`, { params });
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

// Get company by ID
export const getCompanyById = createAsyncThunk(
  'companies/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/companies/${id}`);
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

// Get followed companies
export const getFollowedCompanies = createAsyncThunk(
  'companies/getFollowed',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.get(`${API_URL}/companies/followed`, {
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

// Follow company
export const followCompany = createAsyncThunk(
  'companies/follow',
  async (companyId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.post(
        `${API_URL}/companies/${companyId}/follow`,
        {},
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

export const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.companies = action.payload;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCompanyById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompanyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
      })
      .addCase(getCompanyById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getFollowedCompanies.fulfilled, (state, action) => {
        state.followedCompanies = action.payload;
      })
      .addCase(followCompany.fulfilled, (state, action) => {
        state.followedCompanies.push(action.payload);
      });
  },
});

export const { reset } = companySlice.actions;
export default companySlice.reducer;
