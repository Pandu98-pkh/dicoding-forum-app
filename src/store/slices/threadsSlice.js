import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import * as threadService from '../../services/threadService';

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      return await threadService.getThreads();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch threads',
      );
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      return await threadService.createThread({ title, body, category }, auth.token);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create thread',
      );
    }
  },
);

export const voteThread = createAsyncThunk(
  'threads/voteThread',
  async ({ threadId, voteType, userId }, { getState, rejectWithValue }) => {
    const { threads } = getState();
    const thread = threads.items.find((t) => t.id === threadId);
    const snapshot = {
      upVotesBy: [...(thread?.upVotesBy ?? [])],
      downVotesBy: [...(thread?.downVotesBy ?? [])],
    };
    try {
      const { auth } = getState();
      if (voteType === 'up') {
        await threadService.upVoteThread(threadId, auth.token);
      } else if (voteType === 'down') {
        await threadService.downVoteThread(threadId, auth.token);
      } else {
        await threadService.neutralVoteThread(threadId, auth.token);
      }
      return { threadId, userId, voteType };
    } catch (err) {
      return rejectWithValue({ threadId, ...snapshot, error: err.response?.data?.message || 'Vote failed' });
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    selectedCategory: '',
  },
  reducers: {
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchThreads
      .addCase(fetchThreads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createThread
      .addCase(createThread.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // voteThread — optimistic update
      .addCase(voteThread.pending, (state, action) => {
        const { threadId, voteType, userId } = action.meta.arg;
        const thread = state.items.find((t) => t.id === threadId);
        if (thread) {
          thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
          thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
          if (voteType === 'up') thread.upVotesBy.push(userId);
          if (voteType === 'down') thread.downVotesBy.push(userId);
        }
      })
      .addCase(voteThread.fulfilled, () => {
        // already applied in pending
      })
      .addCase(voteThread.rejected, (state, action) => {
        // rollback
        const { threadId, upVotesBy, downVotesBy } = action.payload;
        const thread = state.items.find((t) => t.id === threadId);
        if (thread) {
          thread.upVotesBy = upVotesBy;
          thread.downVotesBy = downVotesBy;
        }
        state.error = action.payload.error;
      });
  },
});

export const { setSelectedCategory } = threadsSlice.actions;

export const selectAllThreads = (state) => state.threads.items;
export const selectThreadsLoading = (state) => state.threads.isLoading;
export const selectThreadsError = (state) => state.threads.error;
export const selectSelectedCategory = (state) => state.threads.selectedCategory;

export const selectAllCategories = createSelector(
  selectAllThreads,
  (items) => [...new Set(items.map((t) => t.category).filter(Boolean))],
);

const selectFilteredThreads = createSelector(
  [selectAllThreads, selectSelectedCategory],
  (items, category) => (category ? items.filter((t) => t.category === category) : items),
);

export const selectThreadsWithOwners = createSelector(
  [selectFilteredThreads, (state) => state.users.items],
  (threads, users) => threads.map((thread) => ({
    ...thread,
    owner: users.find((u) => u.id === thread.ownerId) || { id: thread.ownerId, name: 'Unknown', avatar: '' },
  })),
);

export default threadsSlice.reducer;
