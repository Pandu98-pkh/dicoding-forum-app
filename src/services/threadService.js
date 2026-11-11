import api, { authHeader } from './api';

export const getThreads = async () => {
  const response = await api.get('/threads');
  return response.data.data.threads;
};

export const createThread = async ({ title, body, category }, token) => {
  const response = await api.post(
    '/threads',
    { title, body, category },
    { headers: authHeader(token) },
  );
  return response.data.data.thread;
};

export const getThreadDetail = async (threadId) => {
  const response = await api.get(`/threads/${threadId}`);
  return response.data.data.detailThread;
};

export const upVoteThread = async (threadId, token) => {
  const response = await api.post(
    `/threads/${threadId}/up-vote`,
    {},
    { headers: authHeader(token) },
  );
  return response.data.data.vote;
};

export const downVoteThread = async (threadId, token) => {
  const response = await api.post(
    `/threads/${threadId}/down-vote`,
    {},
    { headers: authHeader(token) },
  );
  return response.data.data.vote;
};

export const neutralVoteThread = async (threadId, token) => {
  const response = await api.post(
    `/threads/${threadId}/neutral-vote`,
    {},
    { headers: authHeader(token) },
  );
  return response.data.data.vote;
};
