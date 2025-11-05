import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { login, reset } from '../../../store/slices/authSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  useEffect(() => {
    if (isSuccess && user) {
      navigate(user.role === 'employer' ? '/employer/dashboard' : '/dashboard');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 font-medium">
          Sign in to continue your job search
        </p>
      </div>

      {isError && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-fade-in">
          <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Email */}
        <div className="group">
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-blue-500" />
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            required
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300 text-gray-900"
            placeholder="you@example.com"
          />
        </div>

        {/* Password */}
        <div className="group">
          <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <LockClosedIcon className="w-4 h-4 text-purple-500" />
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300 text-gray-900"
            placeholder="Enter your password"
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] hover:shadow-xl group"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="mt-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">New to QwikCareers?</span>
          </div>
        </div>
        <Link
          to="/register"
          className="mt-4 inline-block font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Create your account →
        </Link>
      </div>
    </div>
  );
}
