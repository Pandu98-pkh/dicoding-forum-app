/**
 * Skenario pengujian authSlice:
 *
 * Reducer:
 * 1. Harus mengembalikan initial state
 * 2. loginUser.pending → set isLoading true dan clear error
 * 3. loginUser.fulfilled → set user dan token, isLoading false
 * 4. loginUser.rejected → set error, isLoading false
 * 5. logoutUser → clear user, token, dan error
 * 6. clearAuthError → clear error
 * 7. registerUser.pending → set isLoading true
 * 8. registerUser.rejected → set error dan isLoading false
 * 9. fetchCurrentUser.fulfilled → set user dan token
 * 10. fetchCurrentUser.rejected → clear user dan token
 *
 * Thunk:
 * 11. loginUser sukses → dispatch fulfilled, simpan token di localStorage
 * 12. loginUser gagal → dispatch rejected dengan pesan error
 * 13. registerUser sukses → dispatch fulfilled dengan data user
 * 14. fetchCurrentUser sukses → restore session dari token
 */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser,
  clearAuthError,
} from '../authSlice';
import * as authService from '../../../services/authService';

vi.mock('../../../services/authService');

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

describe('authSlice - Reducer', () => {
  it('1. harus mengembalikan initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('2. loginUser.pending harus set isLoading true dan clear error', () => {
    const state = { ...initialState, error: 'old error' };
    const nextState = reducer(state, loginUser.pending('id'));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('3. loginUser.fulfilled harus set user dan token, isLoading false', () => {
    const payload = { token: 'jwt-abc', user: { id: 'u1', name: 'Alice' } };
    const state = { ...initialState, isLoading: true };
    const nextState = reducer(state, loginUser.fulfilled(payload, 'id'));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.user).toEqual(payload.user);
    expect(nextState.token).toBe('jwt-abc');
  });

  it('4. loginUser.rejected harus set error dan isLoading false', () => {
    const state = { ...initialState, isLoading: true };
    const nextState = reducer(state, loginUser.rejected(null, 'id', {}, 'email or password is wrong'));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('email or password is wrong');
  });

  it('5. logoutUser harus clear user, token, dan error', () => {
    const loggedIn = {
      user: { id: 'u1', name: 'Alice' },
      token: 'jwt-abc',
      isLoading: false,
      error: null,
    };
    const nextState = reducer(loggedIn, logoutUser());
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(nextState.error).toBeNull();
  });

  it('6. clearAuthError harus clear error', () => {
    const stateWithError = { ...initialState, error: 'some error' };
    const nextState = reducer(stateWithError, clearAuthError());
    expect(nextState.error).toBeNull();
  });

  it('7. registerUser.pending harus set isLoading true', () => {
    const nextState = reducer(initialState, registerUser.pending('id'));
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it('8. registerUser.rejected harus set error dan isLoading false', () => {
    const state = { ...initialState, isLoading: true };
    const nextState = reducer(state, registerUser.rejected(null, 'id', {}, 'Email already taken'));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe('Email already taken');
  });

  it('9. fetchCurrentUser.fulfilled harus set user dan token', () => {
    const payload = { token: 'jwt-123', user: { id: 'u2', name: 'Bob' } };
    const nextState = reducer(initialState, fetchCurrentUser.fulfilled(payload, 'id'));
    expect(nextState.user).toEqual(payload.user);
    expect(nextState.token).toBe('jwt-123');
    expect(nextState.isLoading).toBe(false);
  });

  it('10. fetchCurrentUser.rejected harus clear user dan token', () => {
    const loggedIn = {
      user: { id: 'u1' },
      token: 'old-token',
      isLoading: true,
      error: null,
    };
    const nextState = reducer(loggedIn, fetchCurrentUser.rejected(null, 'id'));
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
    expect(nextState.isLoading).toBe(false);
  });
});

describe('authSlice - Thunk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('11. loginUser sukses → dispatch fulfilled, simpan token di localStorage', async () => {
    const mockToken = 'mock-jwt-token';
    const mockUser = { id: 'u1', name: 'Alice', email: 'alice@example.com' };
    authService.login.mockResolvedValue(mockToken);
    authService.getMe.mockResolvedValue(mockUser);

    const store = configureStore({ reducer: { auth: reducer } });
    await store.dispatch(loginUser({ email: 'alice@example.com', password: 'pass123' }));

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('12. loginUser gagal → dispatch rejected dengan pesan error dari server', async () => {
    authService.login.mockRejectedValue({
      response: { data: { message: 'email or password is wrong' } },
    });

    const store = configureStore({ reducer: { auth: reducer } });
    await store.dispatch(loginUser({ email: 'wrong@example.com', password: 'wrong' }));

    const state = store.getState().auth;
    expect(state.error).toBe('email or password is wrong');
    expect(state.user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('13. registerUser sukses → dispatch fulfilled dengan data user baru', async () => {
    const mockUser = { id: 'u-new', name: 'New User', email: 'new@example.com' };
    authService.register.mockResolvedValue(mockUser);

    const store = configureStore({ reducer: { auth: reducer } });
    const result = await store.dispatch(
      registerUser({ name: 'New User', email: 'new@example.com', password: 'pass123' }),
    );

    expect(registerUser.fulfilled.match(result)).toBe(true);
    expect(result.payload).toEqual(mockUser);
  });

  it('14. fetchCurrentUser sukses → restore session dari token yang tersimpan', async () => {
    const mockUser = { id: 'u1', name: 'Alice', email: 'alice@example.com' };
    authService.getMe.mockResolvedValue(mockUser);

    const store = configureStore({ reducer: { auth: reducer } });
    await store.dispatch(fetchCurrentUser('existing-token'));

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('existing-token');
  });
});
