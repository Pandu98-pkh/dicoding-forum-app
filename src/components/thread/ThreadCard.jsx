import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { voteThread } from '../../store/slices/threadsSlice';
import { selectAuthUser } from '../../store/slices/authSlice';
import Avatar from '../common/Avatar';
import VoteButton from '../vote/VoteButton';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

function ThreadCard({ thread }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectAuthUser);

  const handleVote = (voteType) => {
    if (!currentUser) return;
    dispatch(voteThread({ threadId: thread.id, voteType, userId: currentUser.id }));
  };

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {thread.category && (
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full mb-2">
              {`#${thread.category}`}
            </span>
          )}
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            <Link to={`/threads/${thread.id}`} className="hover:text-indigo-600 transition-colors">
              {thread.title}
            </Link>
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            {truncate(stripHtml(thread.body), 200)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Avatar src={thread.owner.avatar} name={thread.owner.name} size="sm" />
          <span className="text-xs text-gray-600">{thread.owner.name}</span>
          <span className="text-xs text-gray-400">&middot;</span>
          <span className="text-xs text-gray-400">{formatDate(thread.createdAt)}</span>
          <span className="text-xs text-gray-400">&middot;</span>
          <span className="text-xs text-gray-400">
            {thread.totalComments}
            {' '}
            comments
          </span>
        </div>

        <VoteButton
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          onVote={handleVote}
          currentUserId={currentUser?.id ?? null}
        />
      </div>
    </article>
  );
}

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    category: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    owner: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ThreadCard;
