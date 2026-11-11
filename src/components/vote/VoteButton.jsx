import PropTypes from 'prop-types';
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown,
} from 'react-icons/fa';

function VoteButton({
  upVotesBy, downVotesBy, onVote, currentUserId,
}) {
  const isUpVoted = Boolean(currentUserId && upVotesBy.includes(currentUserId));
  const isDownVoted = Boolean(currentUserId && downVotesBy.includes(currentUserId));
  const voteCount = upVotesBy.length - downVotesBy.length;

  const handleUpVote = () => {
    if (!currentUserId) return;
    onVote(isUpVoted ? 'neutral' : 'up');
  };

  const handleDownVote = () => {
    if (!currentUserId) return;
    onVote(isDownVoted ? 'neutral' : 'down');
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleUpVote}
        title={currentUserId ? 'Upvote' : 'Login to vote'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm transition-colors ${
          isUpVoted
            ? 'bg-indigo-100 text-indigo-700 font-medium'
            : 'text-gray-500 hover:bg-gray-100'
        } ${!currentUserId ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {isUpVoted ? <FaThumbsUp className="text-base" /> : <FaRegThumbsUp className="text-base" />}
        <span>{upVotesBy.length}</span>
      </button>

      <span className="text-xs text-gray-400 w-6 text-center">{voteCount}</span>

      <button
        type="button"
        onClick={handleDownVote}
        title={currentUserId ? 'Downvote' : 'Login to vote'}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm transition-colors ${
          isDownVoted
            ? 'bg-red-100 text-red-700 font-medium'
            : 'text-gray-500 hover:bg-gray-100'
        } ${!currentUserId ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {isDownVoted ? <FaThumbsDown className="text-base" /> : <FaRegThumbsDown className="text-base" />}
        <span>{downVotesBy.length}</span>
      </button>
    </div>
  );
}

VoteButton.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  onVote: PropTypes.func.isRequired,
  currentUserId: PropTypes.string,
};

VoteButton.defaultProps = {
  currentUserId: null,
};

export default VoteButton;
