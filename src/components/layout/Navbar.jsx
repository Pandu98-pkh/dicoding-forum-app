import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiMenu, HiX } from 'react-icons/hi';
import { selectAuthUser, selectIsLoggedIn, logoutUser } from '../../store/slices/authSlice';
import Avatar from '../common/Avatar';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    closeMenu();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          onClick={closeMenu}
          className="font-bold text-indigo-600 text-lg flex items-center gap-1 hover:text-indigo-700 transition-colors"
        >
          Forum Diskusi
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm transition-colors ${
              isActive('/') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Threads
          </Link>
          <Link
            to="/leaderboard"
            className={`text-sm transition-colors ${
              isActive('/leaderboard') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Leaderboard
          </Link>

          {isLoggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <Avatar src={user?.avatar} name={user?.name || ''} size="sm" />
                <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm transition-colors ${
                  isActive('/login') ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoggedIn && (
            <Avatar src={user?.avatar} name={user?.name || ''} size="sm" />
          )}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg animate-fadeIn">
          {isLoggedIn && user && (
            <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg mb-2">
              <Avatar src={user?.avatar} name={user?.name || ''} size="sm" />
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          <Link
            to="/"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/')
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Threads
          </Link>

          <Link
            to="/leaderboard"
            onClick={closeMenu}
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/leaderboard')
                ? 'bg-indigo-50 text-indigo-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Leaderboard
          </Link>

          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          ) : (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className={`block text-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/login')
                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="block text-center px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
