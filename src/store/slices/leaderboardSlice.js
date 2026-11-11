import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as leaderboardService from '../../services/leaderboardService';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      return await leaderboardService.getLeaderboard();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch leaderboard',
      );
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const selectLeaderboard = (state) => state.leaderboard.items;
export const selectLeaderboardLoading = (state) => state.leaderboard.isLoading;

export default leaderboardSlice.reducer;
