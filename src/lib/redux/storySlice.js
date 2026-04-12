import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/stories'; // Change this to your actual API endpoint

// --- ASYNC THUNKS ---

// Fetch all stories (with optional filters for mission, category, or status)
export const fetchStories = createAsyncThunk(
  'stories/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { params: filters });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch single story
export const fetchStoryById = createAsyncThunk(
  'stories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create Story (Handles FormData for Image Upload)
export const createStory = createAsyncThunk(
  'stories/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Update Story (Fields, Status, Featured, etc.)
export const updateStory = createAsyncThunk(
  'stories/update',
  async ({ id, storyData }, { rejectWithValue }) => {
    try {
      // storyData can be JSON or FormData
      const response = await axios.patch(`${API_URL}/${id}`, storyData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Delete Story
export const deleteStory = createAsyncThunk(
  'stories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// --- SLICE ---

const storySlice = createSlice({
  name: 'stories',
  initialState: {
    stories: [],
    currentStory: null,
    loading: false,
    error: null,
    success: false, // Useful for showing "Saved Successfully" toasts
  },
  reducers: {
    clearStoryStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    resetCurrentStory: (state) => {
      state.currentStory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.currentStory = action.payload;
      })

      // Create
      .addCase(createStory.fulfilled, (state, action) => {
        state.stories.unshift(action.payload);
        state.success = true;
      })

      // Update
      .addCase(updateStory.fulfilled, (state, action) => {
        const index = state.stories.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.stories[index] = action.payload;
        }
        state.currentStory = action.payload;
        state.success = true;
      })

      // Delete
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.stories = state.stories.filter(s => s._id !== action.payload);
        state.success = true;
      });
  },
});

export const { clearStoryStatus, resetCurrentStory } = storySlice.actions;
export default storySlice.reducer;