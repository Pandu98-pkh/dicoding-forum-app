import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser, selectAuthLoading } from '../../store/slices/authSlice';
import LoadingSpinner from '../common/LoadingSpinner';

function ProtectedRoute() {
  const user = useSelector(selectAuthUser);
  const isLoading = useSelector(selectAuthLoading);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
