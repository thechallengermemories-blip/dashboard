import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Story } from '@/types/story';

const API_URL = '/api/stories';

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  loading: boolean;
  error: any;
  success: boolean;
}

const initialState: StoryState = {
  stories: [],
  currentStory: null,
  loading: false,
  error: null,
  success: false,
};

// --- ASYNC THUNKS ---

// Fetch all stories (with optional filters for mission, category, or status)
export const fetchStories = createAsyncThunk(
  'stories/fetchAll',
  async (filters: Record<string, string> | void, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { params: filters || {} });
      return response.data as Story[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single story
export const fetchStoryById = createAsyncThunk(
  'stories/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data as Story;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create Story (Handles FormData or JSON)
export const createStory = createAsyncThunk(
  'stories/create',
  async (storyData: any, { rejectWithValue }) => {
    try {
      const isFormData = storyData instanceof FormData;
      const response = await axios.post(API_URL, storyData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
      });
      return response.data as Story;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update Story (Fields, Status, Featured, etc.)
export const updateStory = createAsyncThunk(
  'stories/update',
  async ({ id, storyData }: { id: string; storyData: any }, { rejectWithValue }) => {
    try {
      const isFormData = storyData instanceof FormData;
      const response = await axios.patch(`${API_URL}/${id}`, storyData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
      });
      return response.data as Story;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete Story
export const deleteStory = createAsyncThunk(
  'stories/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- SLICE ---

const storySlice = createSlice({
  name: 'stories',
  initialState,
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
      .addCase(fetchStories.fulfilled, (state, action: PayloadAction<Story[]>) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single
      .addCase(fetchStoryById.fulfilled, (state, action: PayloadAction<Story>) => {
        state.currentStory = action.payload;
      })

      // Create
      .addCase(createStory.fulfilled, (state, action: PayloadAction<Story>) => {
        state.stories.unshift(action.payload);
        state.success = true;
      })

      // Update
      .addCase(updateStory.fulfilled, (state, action: PayloadAction<Story>) => {
        const index = state.stories.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.stories[index] = action.payload;
        }
        state.currentStory = action.payload;
        state.success = true;
      })

      // Delete
      .addCase(deleteStory.fulfilled, (state, action: PayloadAction<string>) => {
        state.stories = state.stories.filter(s => s._id !== action.payload);
        state.success = true;
      });
  },
});

export const { clearStoryStatus, resetCurrentStory } = storySlice.actions;
export default storySlice.reducer;
