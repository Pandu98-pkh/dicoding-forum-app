import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function CommentForm({ onSubmit, isLoading, isLoggedIn }) {
  const [content, setContent] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mt-6 text-center">
        <p className="text-sm text-gray-500">
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
          {' '}
          to leave a comment.
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Leave a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          required
          placeholder="Write your comment here..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default CommentForm;
