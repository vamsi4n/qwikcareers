const mongoose = require('mongoose');

const companyReviewSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employmentStatus: {
      type: String,
      enum: ['current-employee', 'former-employee', 'intern', 'contractor'],
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    department: String,
    location: String,
    employmentDuration: {
      years: Number,
      months: Number,
    },
    ratings: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      workLifeBalance: {
        type: Number,
        min: 1,
        max: 5,
      },
      compensation: {
        type: Number,
        min: 1,
        max: 5,
      },
      culture: {
        type: Number,
        min: 1,
        max: 5,
      },
      management: {
        type: Number,
        min: 1,
        max: 5,
      },
      careerGrowth: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    pros: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Pros cannot exceed 2000 characters'],
    },
    cons: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Cons cannot exceed 2000 characters'],
    },
    advice: {
      type: String,
      trim: true,
      maxlength: [1000, 'Advice cannot exceed 1000 characters'],
    },
    recommendToFriend: {
      type: Boolean,
      required: true,
    },
    ceoApproval: {
      type: String,
      enum: ['approve', 'disapprove', 'neutral'],
    },
    businessOutlook: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    notHelpfulVotes: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
companyReviewSchema.index({ company: 1, createdAt: -1 });
companyReviewSchema.index({ reviewer: 1 });
companyReviewSchema.index({ moderationStatus: 1 });
companyReviewSchema.index({ 'ratings.overall': -1 });

module.exports = mongoose.model('CompanyReview', companyReviewSchema);
