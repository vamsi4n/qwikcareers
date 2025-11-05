const express = require('express');
const router = express.Router();
const companyReviewController = require('../controllers/company-review.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');

// Public routes
router.get('/companies/:companyId', companyReviewController.getCompanyReviews);
router.get('/companies/:companyId/stats', companyReviewController.getCompanyRatingStats);
router.get('/:id', companyReviewController.getReviewById);

// Protected routes
router.use(authenticate);

router.post('/', companyReviewController.createReview);
router.get('/my/reviews', companyReviewController.getMyReviews);
router.patch('/:id', companyReviewController.updateReview);
router.delete('/:id', companyReviewController.deleteReview);
router.post('/:id/vote', companyReviewController.voteHelpful);

module.exports = router;
