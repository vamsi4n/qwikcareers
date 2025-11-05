import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, reset } from '../../../store/slices/authSlice';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (isSuccess && user) {
      setTimeout(() => {
        navigate(user.role === 'employer' ? '/employer/dashboard' : '/dashboard');
      }, 3000);
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Email Verification
      </h2>

      {isLoading && (
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your email...</p>
        </div>
      )}

      {isError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {message || 'Email verification failed. The link may be invalid or expired.'}
        </div>
      )}

      {isSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          <p className="font-semibold">Email verified successfully!</p>
          <p className="mt-2">Redirecting to your dashboard...</p>
        </div>
      )}
    </div>
  );
}
