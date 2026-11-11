import PropTypes from 'prop-types';
import CommentItem from './CommentItem';

function CommentList({ comments, threadId }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        {comments.length}
        {' '}
        {comments.length === 1 ? 'Comment' : 'Comments'}
      </h2>
      {comments.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} threadId={threadId} />
          ))}
        </div>
      )}
    </div>
  );
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired }),
  ).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentList;
