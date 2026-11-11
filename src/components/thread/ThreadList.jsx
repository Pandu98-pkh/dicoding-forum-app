import PropTypes from 'prop-types';
import ThreadCard from './ThreadCard';

function ThreadList({ threads }) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">&#128172;</p>
        <p>No threads found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
}

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired }),
  ).isRequired,
};

export default ThreadList;
