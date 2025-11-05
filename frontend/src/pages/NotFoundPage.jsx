import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
          >
            Go to Homepage
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate('/jobs')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Browse Jobs
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/companies')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Companies
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
