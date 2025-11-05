const reviewService = require('../services/review.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.user._id, req.body);
  ApiResponse.created(res, review, 'Review created successfully');
});

const getCompanyReviews = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const { page, limit, ...filter } = req.query;
  const result = await reviewService.getCompanyReviews(companyId, page, limit, filter);
  ApiResponse.success(res, result, 'Reviews retrieved successfully');
});

const getReviewById = catchAsync(async (req, res) => {
  const review = await reviewService.getReviewById(req.params.id);
  ApiResponse.success(res, review, 'Review retrieved successfully');
});

const updateReview = catchAsync(async (req, res) => {
  const review = await reviewService.updateReview(req.user._id, req.params.id, req.body);
  ApiResponse.success(res, review, 'Review updated successfully');
});

const deleteReview = catchAsync(async (req, res) => {
  const result = await reviewService.deleteReview(req.user._id, req.params.id);
  ApiResponse.success(res, result, 'Review deleted successfully');
});

const voteHelpful = catchAsync(async (req, res) => {
  const { isHelpful } = req.body;
  const review = await reviewService.voteHelpful(req.user._id, req.params.id, isHelpful);
  ApiResponse.success(res, review, 'Vote recorded successfully');
});

const getMyReviews = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await reviewService.getMyReviews(req.user._id, page, limit);
  ApiResponse.success(res, result, 'Your reviews retrieved successfully');
});

const getCompanyRatingStats = catchAsync(async (req, res) => {
  const stats = await reviewService.getCompanyRatingStats(req.params.companyId);
  ApiResponse.success(res, stats, 'Rating stats retrieved successfully');
});

module.exports = {
  createReview,
  getCompanyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  voteHelpful,
  getMyReviews,
  getCompanyRatingStats
};
