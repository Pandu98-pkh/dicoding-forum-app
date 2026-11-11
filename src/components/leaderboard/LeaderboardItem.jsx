import PropTypes from 'prop-types';
import Avatar from '../common/Avatar';

function LeaderboardItem({ rank, user, score }) {
  const rankColors = {
    1: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    2: 'bg-gray-100 text-gray-600 border-gray-300',
    3: 'bg-orange-100 text-orange-700 border-orange-300',
  };
  const rankClass = rankColors[rank] || 'bg-white text-gray-500 border-gray-200';

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
      <div
        className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold flex-shrink-0 ${rankClass}`}
      >
        {rank}
      </div>
      <Avatar src={user.avatar} name={user.name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-indigo-600">{score}</p>
        <p className="text-xs text-gray-400">pts</p>
      </div>
    </div>
  );
}

LeaderboardItem.propTypes = {
  rank: PropTypes.number.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
  score: PropTypes.number.isRequired,
};

export default LeaderboardItem;
