import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CrewMember } from '@/types/crew';

const API_URL = '/api/crew';

interface CrewState {
  crew: CrewMember[];
  currentCrewMember: CrewMember | null;
  loading: boolean;
  error: any;
  success: boolean;
}

const initialState: CrewState = {
  crew: [],
  currentCrewMember: null,
  loading: false,
  error: null,
  success: false,
};

// --- ASYNC THUNKS ---

// Fetch all crew members
export const fetchCrew = createAsyncThunk(
  'crew/fetchAll',
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.crew as CrewMember[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single crew member by slug
export const fetchCrewBySlug = createAsyncThunk(
  'crew/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${slug}`);
      return response.data.member as CrewMember;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create crew member
export const createCrewMember = createAsyncThunk(
  'crew/create',
  async (crewData: Partial<CrewMember>, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, crewData);
      return response.data.member as CrewMember;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update crew member (identified by slug)
export const updateCrewMember = createAsyncThunk(
  'crew/update',
  async (
    { slug, crewData }: { slug: string; crewData: Partial<CrewMember> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(`${API_URL}/${slug}`, crewData);
      return response.data.member as CrewMember;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete crew member
export const deleteCrewMember = createAsyncThunk(
  'crew/delete',
  async (slug: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${slug}`);
      return slug;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- SLICE ---

const crewSlice = createSlice({
  name: 'crew',
  initialState,
  reducers: {
    clearCrewStatus: (state) => {
      state.success = false;
      state.error = null;
    },
    resetCurrentCrewMember: (state) => {
      state.currentCrewMember = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCrew.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCrew.fulfilled, (state, action: PayloadAction<CrewMember[]>) => {
        state.loading = false;
        state.crew = action.payload;
      })
      .addCase(fetchCrew.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single
      .addCase(fetchCrewBySlug.fulfilled, (state, action: PayloadAction<CrewMember>) => {
        state.currentCrewMember = action.payload;
      })

      // Create
      .addCase(createCrewMember.fulfilled, (state, action: PayloadAction<CrewMember>) => {
        state.crew.push(action.payload);
        state.success = true;
      })

      // Update
      .addCase(updateCrewMember.fulfilled, (state, action: PayloadAction<CrewMember>) => {
        const index = state.crew.findIndex(c => c.slug === action.payload.slug);
        if (index !== -1) {
          state.crew[index] = action.payload;
        }
        state.currentCrewMember = action.payload;
        state.success = true;
      })

      // Delete
      .addCase(deleteCrewMember.fulfilled, (state, action: PayloadAction<string>) => {
        state.crew = state.crew.filter(c => c.slug !== action.payload);
        state.success = true;
      });
  },
});

export const { clearCrewStatus, resetCurrentCrewMember } = crewSlice.actions;
export default crewSlice.reducer;