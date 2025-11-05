import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../../store/slices/authSlice';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">QwikCareers</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 transition">
              Find Jobs
            </Link>
            <Link to="/companies" className="text-gray-700 hover:text-blue-600 transition">
              Companies
            </Link>
            <Link to="/salary-insights" className="text-gray-700 hover:text-blue-600 transition">
              Salaries
            </Link>

            {user ? (
              <>
                {user.role === 'jobseeker' && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                      Dashboard
                    </Link>
                    <Link to="/applications" className="text-gray-700 hover:text-blue-600 transition">
                      Applications
                    </Link>
                  </>
                )}
                {user.role === 'employer' && (
                  <>
                    <Link to="/employer/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                      Dashboard
                    </Link>
                    <Link to="/employer/jobs/post" className="text-gray-700 hover:text-blue-600 transition">
                      Post Job
                    </Link>
                  </>
                )}
                <Link to="/messages" className="text-gray-700 hover:text-blue-600 transition">
                  Messages
                </Link>
                <Link to="/notifications" className="text-gray-700 hover:text-blue-600 transition">
                  Notifications
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
                    <span>{user.firstName}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/preferences"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link to="/jobs" className="block text-gray-700 hover:text-blue-600 py-2">
              Find Jobs
            </Link>
            <Link to="/companies" className="block text-gray-700 hover:text-blue-600 py-2">
              Companies
            </Link>
            <Link to="/salary-insights" className="block text-gray-700 hover:text-blue-600 py-2">
              Salaries
            </Link>
            {user ? (
              <>
                {user.role === 'jobseeker' && (
                  <>
                    <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 py-2">
                      Dashboard
                    </Link>
                    <Link to="/applications" className="block text-gray-700 hover:text-blue-600 py-2">
                      Applications
                    </Link>
                  </>
                )}
                {user.role === 'employer' && (
                  <>
                    <Link to="/employer/dashboard" className="block text-gray-700 hover:text-blue-600 py-2">
                      Dashboard
                    </Link>
                    <Link to="/employer/jobs/post" className="block text-gray-700 hover:text-blue-600 py-2">
                      Post Job
                    </Link>
                  </>
                )}
                <Link to="/messages" className="block text-gray-700 hover:text-blue-600 py-2">
                  Messages
                </Link>
                <Link to="/notifications" className="block text-gray-700 hover:text-blue-600 py-2">
                  Notifications
                </Link>
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600 py-2">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 py-2">
                  Login
                </Link>
                <Link to="/register" className="block text-blue-600 hover:text-blue-700 py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
