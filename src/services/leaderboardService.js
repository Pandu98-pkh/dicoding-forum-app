import api from './api';

export const getLeaderboard = async () => {
  const response = await api.get('/leaderboards');
  return response.data.data.leaderboards;
};
