import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { register, reset } from '../../../store/slices/authSlice';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
  });

  const [errors, setErrors] = useState({});

  const { firstName, lastName, email, password, confirmPassword, role } = formData;

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

  const validate = () => {
    const newErrors = {};

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
    };

    dispatch(register(userData));
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Join QwikCareers
        </h2>
        <p className="text-gray-600 font-medium">
          Start your journey to the perfect career
        </p>
      </div>

      {isError && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-fade-in">
          <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={onSubmit}>
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-500" />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={onChange}
              required
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300 text-gray-900"
              placeholder="John"
            />
          </div>

          <div className="group">
            <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-500" />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={onChange}
              required
              className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-300 text-gray-900"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div className="group">
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-purple-500" />
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChange}
            required
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all hover:border-purple-300 text-gray-900"
            placeholder="you@example.com"
          />
        </div>

        {/* Role */}
        <div className="group">
          <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <BriefcaseIcon className="w-4 h-4 text-pink-500" />
            I am a
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'jobseeker' })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                role === 'jobseeker'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'employer' })}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                role === 'employer'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BriefcaseIcon className="w-5 h-5" />
              Employer
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="group">
          <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <LockClosedIcon className="w-4 h-4 text-orange-500" />
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChange}
            required
            className={`block w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${
              errors.password
                ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                : 'border-gray-200 focus:ring-orange-500 focus:border-transparent hover:border-orange-300'
            }`}
            placeholder="At least 8 characters"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <ExclamationCircleIcon className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            className={`block w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${
              errors.confirmPassword
                ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                : 'border-gray-200 focus:ring-green-500 focus:border-transparent hover:border-green-300'
            }`}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <ExclamationCircleIcon className="w-4 h-4" />
              {errors.confirmPassword}
            </p>
          )}
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Sign In Link */}
      <div className="mt-8 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
          </div>
        </div>
        <Link
          to="/login"
          className="mt-4 inline-block font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Sign in to your account →
        </Link>
      </div>
    </div>
  );
}
