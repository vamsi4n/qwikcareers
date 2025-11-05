const CompanyReview = require('../../../shared/models/CompanyReview.model');
const Company = require('../../../shared/models/Company.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class ReviewService {
  async createReview(userId, reviewData) {
    const { company, ...rest } = reviewData;

    // Check if user already reviewed this company
    const existingReview = await CompanyReview.findOne({
      reviewer: userId,
      company
    });

    if (existingReview) {
      throw new ApiError(httpStatus.CONFLICT, 'You have already reviewed this company');
    }

    // Calculate overall rating
    const ratings = rest.ratings;
    const overallRating =
      (ratings.workLifeBalance +
        ratings.compensation +
        ratings.careerGrowth +
        ratings.management +
        ratings.culture) /
      5;

    const review = await CompanyReview.create({
      reviewer: userId,
      company,
      overallRating,
      ...rest
    });

    // Update company stats
    await this.updateCompanyRatingStats(company);

    return review.populate([
      { path: 'reviewer', select: 'firstName lastName avatar' },
      { path: 'company', select: 'name logo' }
    ]);
  }

  async getCompanyReviews(companyId, page = 1, limit = 20, filter = {}) {
    const skip = (page - 1) * limit;
    const query = { company: companyId, status: 'approved' };

    // Filter by rating
    if (filter.minRating) {
      query.overallRating = { $gte: parseFloat(filter.minRating) };
    }

    // Filter by employment status
    if (filter.employmentStatus) {
      query.employmentStatus = filter.employmentStatus;
    }

    // Filter by job title
    if (filter.jobTitle) {
      query.jobTitle = { $regex: filter.jobTitle, $options: 'i' };
    }

    const reviews = await CompanyReview.find(query)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('company', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CompanyReview.countDocuments(query);

    // Get rating statistics
    const ratingStats = await this.getCompanyRatingStats(companyId);

    return {
      reviews,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      ratingStats
    };
  }

  async getReviewById(reviewId) {
    const review = await CompanyReview.findById(reviewId)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('company', 'name logo');

    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    return review;
  }

  async updateReview(userId, reviewId, updateData) {
    const review = await CompanyReview.findById(reviewId);

    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    // Only reviewer can update
    if (review.reviewer.toString() !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only update your own reviews');
    }

    // Recalculate overall rating if ratings are updated
    if (updateData.ratings) {
      const ratings = updateData.ratings;
      updateData.overallRating =
        (ratings.workLifeBalance +
          ratings.compensation +
          ratings.careerGrowth +
          ratings.management +
          ratings.culture) /
        5;
    }

    Object.assign(review, updateData);
    await review.save();

    // Update company stats
    await this.updateCompanyRatingStats(review.company);

    return review.populate([
      { path: 'reviewer', select: 'firstName lastName avatar' },
      { path: 'company', select: 'name logo' }
    ]);
  }

  async deleteReview(userId, reviewId) {
    const review = await CompanyReview.findById(reviewId);

    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    // Only reviewer can delete
    if (review.reviewer.toString() !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You can only delete your own reviews');
    }

    const companyId = review.company;
    await review.deleteOne();

    // Update company stats
    await this.updateCompanyRatingStats(companyId);

    return { message: 'Review deleted successfully' };
  }

  async voteHelpful(userId, reviewId, isHelpful = true) {
    const review = await CompanyReview.findById(reviewId);

    if (!review) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
    }

    // Check if user already voted
    const hasUpvoted = review.helpfulVotes.includes(userId);
    const hasDownvoted = review.notHelpfulVotes.includes(userId);

    if (isHelpful) {
      if (hasUpvoted) {
        // Remove upvote
        review.helpfulVotes = review.helpfulVotes.filter(
          (id) => id.toString() !== userId
        );
      } else {
        // Add upvote, remove downvote if exists
        if (hasDownvoted) {
          review.notHelpfulVotes = review.notHelpfulVotes.filter(
            (id) => id.toString() !== userId
          );
        }
        review.helpfulVotes.push(userId);
      }
    } else {
      if (hasDownvoted) {
        // Remove downvote
        review.notHelpfulVotes = review.notHelpfulVotes.filter(
          (id) => id.toString() !== userId
        );
      } else {
        // Add downvote, remove upvote if exists
        if (hasUpvoted) {
          review.helpfulVotes = review.helpfulVotes.filter(
            (id) => id.toString() !== userId
          );
        }
        review.notHelpfulVotes.push(userId);
      }
    }

    await review.save();
    return review;
  }

  async getMyReviews(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const reviews = await CompanyReview.find({ reviewer: userId })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CompanyReview.countDocuments({ reviewer: userId });

    return {
      reviews,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async getCompanyRatingStats(companyId) {
    const reviews = await CompanyReview.find({
      company: companyId,
      status: 'approved'
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recommendPercentage: 0
      };
    }

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;
    let recommendCount = 0;

    reviews.forEach((review) => {
      const rating = Math.round(review.overallRating);
      ratingDistribution[rating]++;
      totalRating += review.overallRating;
      if (review.wouldRecommend) recommendCount++;
    });

    return {
      averageRating: (totalRating / reviews.length).toFixed(2),
      totalReviews: reviews.length,
      ratingDistribution,
      recommendPercentage: Math.round((recommendCount / reviews.length) * 100)
    };
  }

  async updateCompanyRatingStats(companyId) {
    const stats = await this.getCompanyRatingStats(companyId);

    await Company.findByIdAndUpdate(companyId, {
      $set: {
        'stats.averageRating': stats.averageRating,
        'stats.reviewCount': stats.totalReviews
      }
    });
  }
}

module.exports = new ReviewService();
