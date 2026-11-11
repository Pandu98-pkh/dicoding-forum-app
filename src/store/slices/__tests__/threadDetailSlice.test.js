/**
 * Skenario pengujian threadDetailSlice:
 *
 * Reducer:
 * 1. Initial state: thread null, semua flag false
 * 2. fetchThreadDetail.fulfilled → set thread dari payload
 * 3. fetchThreadDetail.rejected → set error
 * 4. createComment.fulfilled → push komentar baru ke thread.comments
 * 5. voteComment.pending (up) → optimistic: tambah userId ke comment.upVotesBy
 * 6. voteComment.rejected → rollback vote komentar ke snapshot
 * 7. clearThreadDetail → reset thread dan error ke null
 * 8. voteThread.pending → sync vote di thread detail view
 *
 * Thunk:
 * 9. fetchThreadDetail sukses → state.thread terisi data detail thread
 * 10. createComment sukses → comment baru ditambahkan ke state
 * 11. voteComment sukses → memanggil upVoteComment pada service
 */

import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  fetchThreadDetail,
  createComment,
  voteComment,
  clearThreadDetail,
} from '../threadDetailSlice';
import authReducer from '../authSlice';
import { voteThread } from '../threadsSlice';
import * as threadService from '../../../services/threadService';
import * as commentService from '../../../services/commentService';

vi.mock('../../../services/threadService');
vi.mock('../../../services/commentService');

const mockComment = {
  id: 'comment-1',
  content: 'Komentar pertama',
  createdAt: '2024-01-01T00:00:00Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-1', name: 'Alice', avatar: '' },
};

const mockThread = {
  id: 'thread-1',
  title: 'Thread Diskusi',
  body: '<p>Isi thread</p>',
  category: 'general',
  createdAt: '2024-01-01T00:00:00Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-1', name: 'Alice', avatar: '' },
  comments: [mockComment],
};

const initialState = {
  thread: null,
  isLoading: false,
  isCommentLoading: false,
  error: null,
};

describe('threadDetailSlice - Reducer', () => {
  it('1. initial state harus thread null dan semua flag false', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('2. fetchThreadDetail.fulfilled → set thread dari payload', () => {
    const state = { ...initialState, isLoading: true };
    const nextState = reducer(state, fetchThreadDetail.fulfilled(mockThread, 'id'));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.thread).toEqual(mockThread);
  });

  it('3. fetchThreadDetail.rejected → set error dan isLoading false', () => {
    const state = { ...initialState, isLoading: true };
    const nextState = reducer(state, fetchThreadDetail.rejected(null, 'id', {}, 'Thread not found'));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Thread not found');
  });

  it('4. createComment.fulfilled → push komentar baru ke thread.comments', () => {
    const newComment = { ...mockComment, id: 'comment-2', content: 'Komentar baru' };
    const state = { ...initialState, thread: { ...mockThread } };
    const nextState = reducer(state, createComment.fulfilled(newComment, 'id'));
    expect(nextState.thread.comments).toHaveLength(2);
    expect(nextState.thread.comments[1]).toEqual(newComment);
    expect(nextState.isCommentLoading).toBe(false);
  });

  it('5. voteComment.pending (up) → optimistic: tambah userId ke comment.upVotesBy', () => {
    const state = {
      ...initialState,
      thread: { ...mockThread, comments: [{ ...mockComment, upVotesBy: [], downVotesBy: [] }] },
    };
    const action = voteComment.pending('id', {
      threadId: 'thread-1',
      commentId: 'comment-1',
      voteType: 'up',
      userId: 'user-2',
    });
    const nextState = reducer(state, action);
    expect(nextState.thread.comments[0].upVotesBy).toContain('user-2');
    expect(nextState.thread.comments[0].downVotesBy).not.toContain('user-2');
  });

  it('6. voteComment.rejected → rollback vote komentar ke snapshot', () => {
    const state = {
      ...initialState,
      thread: { ...mockThread, comments: [{ ...mockComment, upVotesBy: ['user-2'] }] },
    };
    const rollbackPayload = {
      commentId: 'comment-1',
      upVotesBy: [],
      downVotesBy: [],
      error: 'Vote failed',
    };
    const nextState = reducer(state, voteComment.rejected(null, 'id', {}, rollbackPayload));
    expect(nextState.thread.comments[0].upVotesBy).toEqual([]);
    expect(nextState.error).toBe('Vote failed');
  });

  it('7. clearThreadDetail → reset thread dan error ke null', () => {
    const state = { ...initialState, thread: mockThread, error: 'some error' };
    const nextState = reducer(state, clearThreadDetail());
    expect(nextState.thread).toBeNull();
    expect(nextState.error).toBeNull();
  });

  it('8. voteThread.pending yang cocok threadId → sync vote di detail view', () => {
    const state = {
      ...initialState,
      thread: { ...mockThread, upVotesBy: [], downVotesBy: [] },
    };
    const action = voteThread.pending('id', { threadId: 'thread-1', voteType: 'up', userId: 'user-2' });
    const nextState = reducer(state, action);
    expect(nextState.thread.upVotesBy).toContain('user-2');
  });
});

describe('threadDetailSlice - Thunk', () => {
  const createStore = (preloadedState = {}) => configureStore({
    reducer: { threadDetail: reducer, auth: authReducer },
    preloadedState,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('9. fetchThreadDetail sukses → state.thread terisi data detail thread', async () => {
    threadService.getThreadDetail.mockResolvedValue(mockThread);

    const store = createStore();
    await store.dispatch(fetchThreadDetail('thread-1'));

    const { threadDetail } = store.getState();
    expect(threadDetail.thread).toEqual(mockThread);
    expect(threadDetail.isLoading).toBe(false);
  });

  it('10. createComment sukses → comment baru ditambahkan ke state', async () => {
    const newComment = { id: 'comment-new', content: 'Komentar dari user' };
    commentService.createComment.mockResolvedValue(newComment);

    const store = createStore({
      threadDetail: { ...initialState, thread: { ...mockThread } },
      auth: {
        token: 'test-token',
        user: { id: 'user-1', name: 'Alice' },
        isLoading: false,
        error: null,
      },
    });

    await store.dispatch(createComment({ threadId: 'thread-1', content: 'Komentar dari user' }));

    const { thread } = store.getState().threadDetail;
    expect(thread.comments).toHaveLength(2);
    expect(thread.comments[1].content).toBe('Komentar dari user');
    expect(thread.comments[1].owner).toEqual({ id: 'user-1', name: 'Alice' });
  });

  it('11. voteComment sukses → memanggil upVoteComment pada service', async () => {
    commentService.upVoteComment.mockResolvedValue({});

    const store = createStore({
      threadDetail: { ...initialState, thread: { ...mockThread } },
      auth: {
        token: 'test-token', user: { id: 'user-1' }, isLoading: false, error: null,
      },
    });

    await store.dispatch(voteComment({
      threadId: 'thread-1',
      commentId: 'comment-1',
      voteType: 'up',
      userId: 'user-1',
    }));

    expect(commentService.upVoteComment).toHaveBeenCalledWith('thread-1', 'comment-1', 'test-token');
  });
});
