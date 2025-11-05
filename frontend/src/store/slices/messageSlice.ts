import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  Message,
  Conversation,
  MessageState,
  ApiResponse,
  RootState
} from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Send message data interface
interface SendMessageData {
  conversation?: string;
  recipient: string;
  content: string;
}

const initialState: MessageState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  error: null,
};

// Get conversations
export const getConversations = createAsyncThunk<
  Conversation[],
  void,
  { state: RootState; rejectValue: string }
>(
  'messages/getConversations',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<Conversation[]>>(
        `${API_URL}/messaging/conversations`,
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
        'Failed to get conversations';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get messages
export const getMessages = createAsyncThunk<
  Message[],
  string,
  { state: RootState; rejectValue: string }
>(
  'messages/getMessages',
  async (conversationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.get<ApiResponse<Message[]>>(
        `${API_URL}/messaging/conversations/${conversationId}/messages`,
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
        'Failed to get messages';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Send message
export const sendMessage = createAsyncThunk<
  Message,
  SendMessageData,
  { state: RootState; rejectValue: string }
>(
  'messages/sendMessage',
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post<ApiResponse<Message>>(
        `${API_URL}/messaging/messages`,
        messageData,
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
        'Failed to send message';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark conversation as read
export const markConversationAsRead = createAsyncThunk<
  Conversation,
  string,
  { state: RootState; rejectValue: string }
>(
  'messages/markAsRead',
  async (conversationId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await axios.post<ApiResponse<Conversation>>(
        `${API_URL}/messaging/conversations/${conversationId}/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Failed to mark conversation as read';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    resetMessageState: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
        state.error = null;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get conversations';
      })
      .addCase(getMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get messages';
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send message';
      })
      .addCase(markConversationAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markConversationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.conversations.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.conversations[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(markConversationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to mark conversation as read';
      });
  },
});

export const { resetMessageState, setCurrentConversation, clearMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
