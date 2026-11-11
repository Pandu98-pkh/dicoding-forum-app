import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/userService';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getUsers();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch users',
      );
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const selectAllUsers = (state) => state.users.items;
export const selectUsersLoading = (state) => state.users.isLoading;
export const selectUserById = (id) => (state) => state.users.items.find((u) => u.id === id);

export default usersSlice.reducer;
