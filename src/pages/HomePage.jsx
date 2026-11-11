import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchThreads,
  setSelectedCategory,
  selectThreadsLoading,
  selectThreadsError,
  selectThreadsWithOwners,
  selectAllCategories,
  selectSelectedCategory,
} from '../store/slices/threadsSlice';
import { selectIsLoggedIn } from '../store/slices/authSlice';
import { fetchUsers } from '../store/slices/usersSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import CategoryFilter from '../components/common/CategoryFilter';
import ThreadList from '../components/thread/ThreadList';

function HomePage() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectThreadsLoading);
  const error = useSelector(selectThreadsError);
  const threads = useSelector(selectThreadsWithOwners);
  const categories = useSelector(selectAllCategories);
  const selectedCategory = useSelector(selectSelectedCategory);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchThreads());
    dispatch(fetchUsers());
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
        {isLoggedIn && (
          <Link
            to="/threads/new"
            className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            + Create Thread
          </Link>
        )}
      </div>

      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={(cat) => dispatch(setSelectedCategory(cat))}
      />

      <ThreadList threads={threads} />
    </div>
  );
}

export default HomePage;
