/**
 * Skenario pengujian threadsSlice:
 *
 * Reducer:
 * 1. fetchThreads.pending → set isLoading true dan clear error
 * 2. fetchThreads.fulfilled → set items dari payload
 * 3. fetchThreads.rejected → set error dan isLoading false
 * 4. createThread.fulfilled → prepend thread baru ke items
 * 5. voteThread.pending (up) → optimistic: tambah userId ke upVotesBy
 * 6. voteThread.pending (down) → optimistic: tambah userId ke downVotesBy
 * 7. voteThread.pending (neutral) → optimistic: hapus userId dari keduanya
 * 8. voteThread.rejected → rollback ke snapshot sebelum vote
 * 9. setSelectedCategory → update selectedCategory
 *
 * Thunk:
 * 10. fetchThreads sukses → state.items terisi data dari service
 * 11. fetchThreads gagal → state.error terisi pesan error
 * 12. createThread sukses → thread baru muncul di posisi pertama
 * 13. voteThread up → memanggil upVoteThread pada service
 * 14. voteThread down → memanggil downVoteThread pada service
 * 15. voteThread neutral → memanggil neutralVoteThread pada service
 */

import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  fetchThreads,
  createThread,
  voteThread,
  setSelectedCategory,
} from '../threadsSlice';
import authReducer from '../authSlice';
import * as threadService from '../../../services/threadService';

vi.mock('../../../services/threadService');

const mockThread = {
  id: 'thread-1',
  title: 'Thread Pertama',
  body: 'Isi thread pertama',
  category: 'general',
  createdAt: '2024-01-01T00:00:00Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  selectedCategory: '',
};

describe('threadsSlice - Reducer', () => {
  it('1. fetchThreads.pending harus set isLoading true dan clear error', () => {
    const state = { ...initialState, error: 'old error' };
    const nextState = reducer(state, fetchThreads.pending('id'));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('2. fetchThreads.fulfilled harus set items dari payload', () => {
    const threads = [mockThread, { ...mockThread, id: 'thread-2', title: 'Thread Kedua' }];
    const state = { ...initialState, isLoading: true };
    const nextState = reducer(state, fetchThreads.fulfilled(threads, 'id'));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.items).toEqual(threads);
    expect(nextState.items).toHaveLength(2);
  });

  it('3. fetchThreads.rejected harus set error dan isLoading false', () => {
    const state = { ...initialState, isLoading: true };
    const nextState = reducer(state, fetchThreads.rejected(null, 'id', {}, 'Network Error'));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Network Error');
  });

  it('4. createThread.fulfilled harus prepend thread baru ke items', () => {
    const existingThread = { ...mockThread, id: 'thread-old' };
    const newThread = { ...mockThread, id: 'thread-new', title: 'Thread Baru' };
    const state = { ...initialState, items: [existingThread] };
    const nextState = reducer(state, createThread.fulfilled(newThread, 'id'));
    expect(nextState.items[0]).toEqual(newThread);
    expect(nextState.items).toHaveLength(2);
  });

  it('5. voteThread.pending (up) → optimistic: tambah userId ke upVotesBy', () => {
    const state = {
      ...initialState,
      items: [{ ...mockThread, upVotesBy: [], downVotesBy: [] }],
    };
    const action = voteThread.pending('id', { threadId: 'thread-1', voteType: 'up', userId: 'user-2' });
    const nextState = reducer(state, action);
    expect(nextState.items[0].upVotesBy).toContain('user-2');
    expect(nextState.items[0].downVotesBy).not.toContain('user-2');
  });

  it('6. voteThread.pending (down) → optimistic: tambah userId ke downVotesBy', () => {
    const state = {
      ...initialState,
      items: [{ ...mockThread, upVotesBy: [], downVotesBy: [] }],
    };
    const action = voteThread.pending('id', { threadId: 'thread-1', voteType: 'down', userId: 'user-2' });
    const nextState = reducer(state, action);
    expect(nextState.items[0].downVotesBy).toContain('user-2');
    expect(nextState.items[0].upVotesBy).not.toContain('user-2');
  });

  it('7. voteThread.pending (neutral) → optimistic: hapus userId dari keduanya', () => {
    const state = {
      ...initialState,
      items: [{ ...mockThread, upVotesBy: ['user-2'], downVotesBy: [] }],
    };
    const action = voteThread.pending('id', { threadId: 'thread-1', voteType: 'neutral', userId: 'user-2' });
    const nextState = reducer(state, action);
    expect(nextState.items[0].upVotesBy).not.toContain('user-2');
    expect(nextState.items[0].downVotesBy).not.toContain('user-2');
  });

  it('8. voteThread.rejected → rollback ke snapshot sebelum vote', () => {
    const state = {
      ...initialState,
      items: [{ ...mockThread, upVotesBy: ['user-2'], downVotesBy: [] }],
    };
    const rollbackPayload = {
      threadId: 'thread-1',
      upVotesBy: [],
      downVotesBy: [],
      error: 'Vote failed',
    };
    const nextState = reducer(state, voteThread.rejected(null, 'id', {}, rollbackPayload));
    expect(nextState.items[0].upVotesBy).toEqual([]);
    expect(nextState.error).toBe('Vote failed');
  });

  it('9. setSelectedCategory harus update selectedCategory', () => {
    const nextState = reducer(initialState, setSelectedCategory('teknologi'));
    expect(nextState.selectedCategory).toBe('teknologi');
  });
});

describe('threadsSlice - Thunk', () => {
  const createStore = (preloadedState = {}) => configureStore({
    reducer: { threads: reducer, auth: authReducer },
    preloadedState,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('10. fetchThreads sukses → state.items terisi data dari service', async () => {
    const mockThreads = [mockThread, { ...mockThread, id: 'thread-2' }];
    threadService.getThreads.mockResolvedValue(mockThreads);

    const store = createStore();
    await store.dispatch(fetchThreads());

    const { threads } = store.getState();
    expect(threads.items).toEqual(mockThreads);
    expect(threads.isLoading).toBe(false);
    expect(threads.error).toBeNull();
  });

  it('11. fetchThreads gagal → state.error terisi pesan error', async () => {
    threadService.getThreads.mockRejectedValue({
      response: { data: { message: 'Gagal mengambil threads' } },
    });

    const store = createStore();
    await store.dispatch(fetchThreads());

    const { threads } = store.getState();
    expect(threads.error).toBe('Gagal mengambil threads');
    expect(threads.items).toEqual([]);
  });

  it('12. createThread sukses → thread baru muncul di posisi pertama', async () => {
    const newThread = { ...mockThread, id: 'thread-new', title: 'Thread Baru' };
    threadService.createThread.mockResolvedValue(newThread);

    const store = createStore({
      threads: { ...initialState, items: [mockThread] },
      auth: {
        token: 'test-token', user: { id: 'user-1' }, isLoading: false, error: null,
      },
    });

    await store.dispatch(createThread({ title: 'Thread Baru', body: 'Isi', category: 'general' }));

    const { items } = store.getState().threads;
    expect(items[0]).toEqual(newThread);
    expect(items[0].id).toBe('thread-new');
  });

  it('13. voteThread up → memanggil upVoteThread pada service', async () => {
    threadService.upVoteThread.mockResolvedValue({});

    const store = createStore({
      threads: { ...initialState, items: [mockThread] },
      auth: {
        token: 'test-token', user: { id: 'user-1' }, isLoading: false, error: null,
      },
    });

    await store.dispatch(voteThread({ threadId: 'thread-1', voteType: 'up', userId: 'user-1' }));
    expect(threadService.upVoteThread).toHaveBeenCalledWith('thread-1', 'test-token');
  });

  it('14. voteThread down → memanggil downVoteThread pada service', async () => {
    threadService.downVoteThread.mockResolvedValue({});

    const store = createStore({
      threads: { ...initialState, items: [mockThread] },
      auth: {
        token: 'test-token', user: { id: 'user-1' }, isLoading: false, error: null,
      },
    });

    await store.dispatch(voteThread({ threadId: 'thread-1', voteType: 'down', userId: 'user-1' }));
    expect(threadService.downVoteThread).toHaveBeenCalledWith('thread-1', 'test-token');
  });

  it('15. voteThread neutral → memanggil neutralVoteThread pada service', async () => {
    threadService.neutralVoteThread.mockResolvedValue({});

    const store = createStore({
      threads: { ...initialState, items: [{ ...mockThread, upVotesBy: ['user-1'] }] },
      auth: {
        token: 'test-token', user: { id: 'user-1' }, isLoading: false, error: null,
      },
    });

    await store.dispatch(voteThread({ threadId: 'thread-1', voteType: 'neutral', userId: 'user-1' }));
    expect(threadService.neutralVoteThread).toHaveBeenCalledWith('thread-1', 'test-token');
  });
});
