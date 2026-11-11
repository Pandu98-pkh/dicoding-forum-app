import { useRef, useState } from 'react';
import PropTypes from 'prop-types';

function ThreadForm({ onSubmit, isLoading, error }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [bodyEmpty, setBodyEmpty] = useState(true);
  const bodyRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bodyHtml = bodyRef.current ? bodyRef.current.innerHTML : '';
    const bodyText = bodyRef.current ? bodyRef.current.innerText.trim() : '';
    if (!title.trim() || !bodyText) return;
    onSubmit({ title, body: bodyHtml, category });
  };

  const handleBodyInput = () => {
    const text = bodyRef.current ? bodyRef.current.innerText.trim() : '';
    setBodyEmpty(text.length === 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={255}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="What's on your mind?"
          />
        </label>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
          <small className="text-gray-400 ml-1">(optional)</small>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. General, Tech, Question"
          />
        </label>
      </div>

      <div>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body *
        </label>
        <div
          id="body"
          ref={bodyRef}
          role="textbox"
          aria-multiline="true"
          aria-label="Body"
          aria-required="true"
          contentEditable
          onInput={handleBodyInput}
          data-placeholder="Write your thread details here..."
          className="min-h-[12rem] w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y overflow-auto empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
          suppressContentEditableWarning
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading || !title.trim() || bodyEmpty}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Posting...' : 'Post Thread'}
        </button>
      </div>
    </form>
  );
}

ThreadForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

ThreadForm.defaultProps = {
  error: null,
};

export default ThreadForm;
