import api, { authHeader } from './api';

export const register = async ({ name, email, password }) => {
  const response = await api.post('/register', { name, email, password });
  return response.data.data.user;
};

export const login = async ({ email, password }) => {
  const response = await api.post('/login', { email, password });
  return response.data.data.token;
};

export const getMe = async (token) => {
  const response = await api.get('/users/me', { headers: authHeader(token) });
  return response.data.data.user;
};
