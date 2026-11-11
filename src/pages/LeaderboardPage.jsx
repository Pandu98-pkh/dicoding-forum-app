import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard, selectLeaderboard, selectLeaderboardLoading } from '../store/slices/leaderboardSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LeaderboardItem from '../components/leaderboard/LeaderboardItem';
import LeaderboardChart from '../components/leaderboard/LeaderboardChart';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectLeaderboard);
  const isLoading = useSelector(selectLeaderboardLoading);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leaderboard</h1>

      {items.length > 0 && <LeaderboardChart items={items} />}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
          Semua Peringkat
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No data available.</p>
        ) : (
          items.map((item, index) => (
            <LeaderboardItem
              key={item.user.id}
              rank={index + 1}
              user={item.user}
              score={item.score}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
