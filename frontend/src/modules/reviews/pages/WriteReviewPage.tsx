import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCompanies } from '../../../store/slices/companySlice';

export default function WriteReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.companies);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    company: location.state?.companyId || '',
    rating: 0,
    title: '',
    position: '',
    employmentStatus: 'current',
    review: '',
    pros: '',
    cons: '',
    wouldRecommend: true,
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getAllCompanies());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.company) {
      newErrors.company = 'Please select a company';
    }
    if (formData.rating === 0) {
      newErrors.rating = 'Please provide a rating';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Please enter a review title';
    }
    if (!formData.position.trim()) {
      newErrors.position = 'Please enter your position';
    }
    if (!formData.review.trim()) {
      newErrors.review = 'Please write your review';
    } else if (formData.review.trim().length < 50) {
      newErrors.review = 'Review must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: Dispatch action to submit review
    // await dispatch(submitReview(formData));

    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to company reviews page
      navigate(`/companies/${formData.company}/reviews`);
    }, 1000);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => handleRatingClick(star)}
        onMouseEnter={() => setHoveredRating(star)}
        onMouseLeave={() => setHoveredRating(0)}
        className="focus:outline-none transition transform hover:scale-110"
      >
        <svg
          className={`w-10 h-10 ${
            star <= (hoveredRating || formData.rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ));
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to write a review</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Write a Company Review</h1>
        <p className="text-gray-600 mt-2">
          Share your experience to help others make informed decisions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Company Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company <span className="text-red-500">*</span>
          </label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.company ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a company</option>
            {companies?.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
          {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {renderStars()}
            {formData.rating > 0 && (
              <span className="ml-2 text-gray-600">
                {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
          {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
        </div>

        {/* Review Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Summarize your experience in one sentence"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position/Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="e.g. Software Engineer"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.position ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Status
            </label>
            <select
              name="employmentStatus"
              value={formData.employmentStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="current">Current Employee</option>
              <option value="former">Former Employee</option>
              <option value="intern">Intern</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>
        </div>

        {/* Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={6}
            placeholder="Share your experience working at this company... (minimum 50 characters)"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
              errors.review ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.review ? (
              <p className="text-sm text-red-500">{errors.review}</p>
            ) : (
              <p className="text-sm text-gray-500">
                {formData.review.length} / 50 minimum characters
              </p>
            )}
          </div>
        </div>

        {/* Pros */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pros (What you liked)
          </label>
          <textarea
            name="pros"
            value={formData.pros}
            onChange={handleChange}
            rows={3}
            placeholder="What are the best things about working here?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Cons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cons (What could be improved)
          </label>
          <textarea
            name="cons"
            value={formData.cons}
            onChange={handleChange}
            rows={3}
            placeholder="What could be improved at this company?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Would Recommend */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="wouldRecommend"
            name="wouldRecommend"
            checked={formData.wouldRecommend}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="wouldRecommend" className="ml-2 text-sm text-gray-700">
            I would recommend this company to a friend
          </label>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Review Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be honest and respectful</li>
            <li>• Focus on your personal experience</li>
            <li>• Avoid including confidential information</li>
            <li>• Don't use offensive language</li>
            <li>• Keep it professional and constructive</li>
          </ul>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
}
