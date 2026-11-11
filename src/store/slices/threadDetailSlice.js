import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as threadService from '../../services/threadService';
import * as commentService from '../../services/commentService';
// Import voteThread to sync detail view when voting from thread detail page
import { voteThread } from './threadsSlice';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      return await threadService.getThreadDetail(threadId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch thread',
      );
    }
  },
);

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const comment = await commentService.createComment({ threadId, content }, auth.token);
      return { ...comment, owner: auth.user };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create comment',
      );
    }
  },
);

export const voteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({
    threadId, commentId, voteType, userId,
  }, { getState, rejectWithValue }) => {
    const { threadDetail } = getState();
    const comment = threadDetail.thread?.comments?.find((c) => c.id === commentId);
    const snapshot = {
      upVotesBy: [...(comment?.upVotesBy ?? [])],
      downVotesBy: [...(comment?.downVotesBy ?? [])],
    };
    try {
      const { auth } = getState();
      if (voteType === 'up') {
        await commentService.upVoteComment(threadId, commentId, auth.token);
      } else if (voteType === 'down') {
        await commentService.downVoteComment(threadId, commentId, auth.token);
      } else {
        await commentService.neutralVoteComment(threadId, commentId, auth.token);
      }
      return { commentId, userId, voteType };
    } catch (err) {
      return rejectWithValue({ commentId, ...snapshot, error: err.response?.data?.message || 'Vote failed' });
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    isLoading: false,
    isCommentLoading: false,
    error: null,
  },
  reducers: {
    clearThreadDetail(state) {
      state.thread = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchThreadDetail
      .addCase(fetchThreadDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.thread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // createComment
      .addCase(createComment.pending, (state) => {
        state.isCommentLoading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isCommentLoading = false;
        if (state.thread) {
          state.thread.comments.push(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isCommentLoading = false;
        state.error = action.payload;
      })
      // voteComment — optimistic
      .addCase(voteComment.pending, (state, action) => {
        const { commentId, voteType, userId } = action.meta.arg;
        const comment = state.thread?.comments?.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
          comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
          if (voteType === 'up') comment.upVotesBy.push(userId);
          if (voteType === 'down') comment.downVotesBy.push(userId);
        }
      })
      .addCase(voteComment.fulfilled, () => {
        // already applied in pending
      })
      .addCase(voteComment.rejected, (state, action) => {
        const { commentId, upVotesBy, downVotesBy } = action.payload;
        const comment = state.thread?.comments?.find((c) => c.id === commentId);
        if (comment) {
          comment.upVotesBy = upVotesBy;
          comment.downVotesBy = downVotesBy;
        }
        state.error = action.payload.error;
      })
      // Sync vote state in thread detail when user votes via voteThread thunk
      .addCase(voteThread.pending, (state, action) => {
        const { threadId, voteType, userId } = action.meta.arg;
        if (state.thread && state.thread.id === threadId) {
          state.thread.upVotesBy = state.thread.upVotesBy.filter((id) => id !== userId);
          state.thread.downVotesBy = state.thread.downVotesBy.filter((id) => id !== userId);
          if (voteType === 'up') state.thread.upVotesBy.push(userId);
          if (voteType === 'down') state.thread.downVotesBy.push(userId);
        }
      })
      .addCase(voteThread.rejected, (state, action) => {
        const { threadId, upVotesBy, downVotesBy } = action.payload;
        if (state.thread && state.thread.id === threadId) {
          state.thread.upVotesBy = upVotesBy;
          state.thread.downVotesBy = downVotesBy;
        }
      });
  },
});

export const { clearThreadDetail } = threadDetailSlice.actions;

export const selectThreadDetail = (state) => state.threadDetail.thread;
export const selectThreadDetailLoading = (state) => state.threadDetail.isLoading;
export const selectCommentLoading = (state) => state.threadDetail.isCommentLoading;
export const selectThreadDetailError = (state) => state.threadDetail.error;

export default threadDetailSlice.reducer;
