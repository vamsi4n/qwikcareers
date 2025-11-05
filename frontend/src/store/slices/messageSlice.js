import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get conversations
export const getConversations = createAsyncThunk(
  'messages/getConversations',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.get(`${API_URL}/messaging/conversations`, {
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

// Get messages
export const getMessages = createAsyncThunk(
  'messages/getMessages',
  async (conversationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.get(`${API_URL}/messaging/conversations/${conversationId}/messages`, {
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

// Send message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.post(`${API_URL}/messaging/messages`, messageData, {
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

// Mark conversation as read
export const markConversationAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (conversationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await axios.post(
        `${API_URL}/messaging/conversations/${conversationId}/mark-read`,
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

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        const index = state.conversations.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.conversations[index] = action.payload;
        }
      });
  },
});

export const { reset, setCurrentConversation } = messageSlice.actions;
export default messageSlice.reducer;
