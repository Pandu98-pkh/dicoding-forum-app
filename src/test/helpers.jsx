import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../store/slices/authSlice';
import threadsReducer from '../store/slices/threadsSlice';
import threadDetailReducer from '../store/slices/threadDetailSlice';
import usersReducer from '../store/slices/usersSlice';
import leaderboardReducer from '../store/slices/leaderboardSlice';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    initialEntries = ['/'],
    ...renderOptions
  } = {},
) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      threads: threadsReducer,
      threadDetail: threadDetailReducer,
      users: usersReducer,
      leaderboard: leaderboardReducer,
    },
    preloadedState,
  });

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
