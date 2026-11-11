/**
 * Stories untuk komponen VoteButton.
 *
 * Story ini menampilkan berbagai variasi VoteButton:
 * - Default: tanpa vote, user belum login
 * - WithVotes: dengan beberapa upvote dan downvote
 * - LoggedIn: user sudah login tetapi belum vote
 * - UserUpvoted: user sudah memberikan upvote
 */

import VoteButton from '../components/vote/VoteButton';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
  tags: ['autodocs'],
  argTypes: {
    onVote: { action: 'voted' },
  },
};

export const Default = {
  args: {
    upVotesBy: [],
    downVotesBy: [],
    currentUserId: null,
  },
};

export const WithVotes = {
  args: {
    upVotesBy: ['user-1', 'user-2', 'user-3'],
    downVotesBy: ['user-4'],
    currentUserId: null,
  },
};

export const LoggedInNotVoted = {
  args: {
    upVotesBy: ['user-1', 'user-2'],
    downVotesBy: [],
    currentUserId: 'current-user',
  },
};

export const UserUpvoted = {
  args: {
    upVotesBy: ['current-user', 'user-1'],
    downVotesBy: [],
    currentUserId: 'current-user',
  },
};

export const UserDownvoted = {
  args: {
    upVotesBy: [],
    downVotesBy: ['current-user'],
    currentUserId: 'current-user',
  },
};
