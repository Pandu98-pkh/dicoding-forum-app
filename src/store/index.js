import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import threadsReducer from './slices/threadsSlice';
import threadDetailReducer from './slices/threadDetailSlice';
import usersReducer from './slices/usersSlice';
import leaderboardReducer from './slices/leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    users: usersReducer,
    leaderboard: leaderboardReducer,
  },
});

export default store;
