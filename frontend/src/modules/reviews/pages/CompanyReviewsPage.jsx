import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanyDetails } from '../../../store/slices/companySlice';

export default function CompanyReviewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedCompany: company, isLoading } = useSelector((state) => state.companies);
  const { user } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState('all'); // all, positive, negative
  const [sortBy, setSortBy] = useState('recent'); // recent, highest, lowest

  useEffect(() => {
    if (id) {
      dispatch(getCompanyDetails(id));
    }
  }, [id, dispatch]);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const filteredAndSortedReviews = company?.reviews
    ? company.reviews
        .filter((review) => {
          if (filter === 'positive') return review.rating >= 4;
          if (filter === 'negative') return review.rating <= 2;
          return true;
        })
        .sort((a, b) => {
          if (sortBy === 'highest') return b.rating - a.rating;
          if (sortBy === 'lowest') return a.rating - b.rating;
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    : [];

  if (isLoading && !company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Company not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(`/companies/${id}`)}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Company Profile
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{company.name} Reviews</h1>
        <p className="text-gray-600 mt-2">
          {company.reviewsCount || 0} employee reviews
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Overall Rating & Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            {/* Overall Rating */}
            <div className="text-center mb-6 pb-6 border-b border-gray-200">
              <div className="text-5xl font-bold text-gray-900 mb-2">{company.rating || '0.0'}</div>
              <div className="flex items-center justify-center mb-2">
                {renderStars(Math.round(company.rating || 0))}
              </div>
              <p className="text-sm text-gray-600">{company.reviewsCount || 0} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = company.reviews?.filter((r) => r.rating === stars).length || 0;
                const percentage = company.reviews?.length
                  ? (count / company.reviews.length) * 100
                  : 0;

                return (
                  <div key={stars} className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 w-8">{stars} ⭐</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Filter Reviews</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${
                    filter === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  All Reviews
                </button>
                <button
                  onClick={() => setFilter('positive')}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${
                    filter === 'positive' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Positive (4-5 ⭐)
                </button>
                <button
                  onClick={() => setFilter('negative')}
                  className={`w-full text-left px-3 py-2 rounded-md transition ${
                    filter === 'negative' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  Needs Improvement (1-2 ⭐)
                </button>
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => user ? navigate('/reviews/write', { state: { companyId: id } }) : navigate('/login')}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition font-medium"
            >
              Write a Review
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2">
          {/* Sort */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {filteredAndSortedReviews.length} review{filteredAndSortedReviews.length !== 1 ? 's' : ''}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {filteredAndSortedReviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-gray-600">No reviews match your criteria</p>
              </div>
            ) : (
              filteredAndSortedReviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {review.user?.name?.[0] || 'A'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">{review.position || 'Employee'}</p>
                        {review.employmentStatus && (
                          <p className="text-xs text-gray-500">{review.employmentStatus}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {review.title && (
                    <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
                  )}

                  <p className="text-gray-700 mb-4 whitespace-pre-line">{review.review}</p>

                  {review.pros && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-green-700 mb-1">Pros:</p>
                      <p className="text-sm text-gray-700">{review.pros}</p>
                    </div>
                  )}

                  {review.cons && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-red-700 mb-1">Cons:</p>
                      <p className="text-sm text-gray-700">{review.cons}</p>
                    </div>
                  )}

                  {review.helpful && review.helpful > 0 && (
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <span>{review.helpful} people found this helpful</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Helpful
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
