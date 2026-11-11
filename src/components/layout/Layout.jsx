import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-200">
        Forum Diskusi &copy;
        {' '}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default Layout;
