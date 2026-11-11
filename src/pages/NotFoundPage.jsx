import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <p className="text-7xl font-bold text-gray-200 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-700 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
