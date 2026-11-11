import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchThreadDetail,
  createComment,
  selectThreadDetail,
  selectThreadDetailLoading,
  selectCommentLoading,
  selectThreadDetailError,
} from '../store/slices/threadDetailSlice';
import { voteThread } from '../store/slices/threadsSlice';
import { selectAuthUser, selectIsLoggedIn } from '../store/slices/authSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Avatar from '../components/common/Avatar';
import VoteButton from '../components/vote/VoteButton';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function ThreadDetailPage() {
  const dispatch = useDispatch();
  const { id: threadId } = useParams();
  const thread = useSelector(selectThreadDetail);
  const isLoading = useSelector(selectThreadDetailLoading);
  const isCommentLoading = useSelector(selectCommentLoading);
  const error = useSelector(selectThreadDetailError);
  const currentUser = useSelector(selectAuthUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  const handleVoteThread = (voteType) => {
    if (!currentUser) return;
    dispatch(voteThread({ threadId, voteType, userId: currentUser.id }));
  };

  const handleCreateComment = (content) => {
    dispatch(createComment({ threadId, content }));
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchThreadDetail(threadId))}
      />
    );
  }
  if (!thread) return null;

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
        &#8592; Back to threads
      </Link>

      <article className="bg-white rounded-xl border border-gray-200 p-6">
        {thread.category && (
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
            {`#${thread.category}`}
          </span>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{thread.title}</h1>

        <div className="flex items-center gap-3 mb-5">
          <Avatar src={thread.owner?.avatar} name={thread.owner?.name} size="md" />
          <div>
            <p className="text-sm font-medium text-gray-900">{thread.owner?.name}</p>
            <p className="text-xs text-gray-400">{formatDate(thread.createdAt)}</p>
          </div>
        </div>

        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-5"
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />

        <VoteButton
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          onVote={handleVoteThread}
          currentUserId={currentUser?.id ?? null}
        />
      </article>

      <CommentForm
        onSubmit={handleCreateComment}
        isLoading={isCommentLoading}
        isLoggedIn={isLoggedIn}
      />

      <CommentList comments={thread.comments ?? []} threadId={threadId} />
    </div>
  );
}

export default ThreadDetailPage;
