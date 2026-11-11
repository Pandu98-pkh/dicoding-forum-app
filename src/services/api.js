import axios from 'axios';

const api = axios.create({
  baseURL: 'https://forum-api.dicoding.dev/v1',
});

export const authHeader = (token) => ({
  Authorization: `Bearer ${token}`,
});

export default api;
