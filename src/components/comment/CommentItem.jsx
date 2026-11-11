import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { voteComment } from '../../store/slices/threadDetailSlice';
import { selectAuthUser } from '../../store/slices/authSlice';
import Avatar from '../common/Avatar';
import VoteButton from '../vote/VoteButton';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);

  const handleVote = (voteType) => {
    if (!currentUser) return;
    dispatch(voteComment({
      threadId,
      commentId: comment.id,
      voteType,
      userId: currentUser.id,
    }));
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar src={comment.owner?.avatar} name={comment.owner?.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {comment.owner?.name ?? 'Unknown'}
            </span>
            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
          </div>
          <div
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          <div className="mt-2">
            <VoteButton
              upVotesBy={comment.upVotesBy}
              downVotesBy={comment.downVotesBy}
              onVote={handleVote}
              currentUserId={currentUser?.id ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    owner: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
