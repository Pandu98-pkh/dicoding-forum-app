import api, { authHeader } from './api';

export const createComment = async ({ threadId, content }, token) => {
  const response = await api.post(
    `/threads/${threadId}/comments`,
    { content },
    { headers: authHeader(token) },
  );
  return response.data.data.comment;
};

export const upVoteComment = async (threadId, commentId, token) => {
  const response = await api.post(
    `/threads/${threadId}/comments/${commentId}/up-vote`,
    {},
    { headers: authHeader(token) },
  );
  return response.data.data.vote;
};

export const downVoteComment = async (threadId, commentId, token) => {
  const response = await api.post(
    `/threads/${threadId}/comments/${commentId}/down-vote`,
    {},
    { headers: authHeader(token) },
  );
  return response.data.data.vote;
};

export const neutralVoteComment = async (threadId, commentId, token) => {
  const response = await api.post(
    `/threads/${threadId}/comments/${commentId}/neutral-vote`,
    {},
    { headers: authHeader(token) },
  );
  return response.data.data.vote;
};
