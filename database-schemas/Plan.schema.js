const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    targetAudience: {
      type: String,
      enum: ['jobseeker', 'employer', 'both'],
      required: true,
    },
    type: {
      type: String,
      enum: ['free', 'basic', 'professional', 'enterprise', 'custom'],
      required: true,
    },
    pricing: {
      monthly: Number,
      quarterly: Number,
      yearly: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    features: [
      {
        name: String,
        value: mongoose.Schema.Types.Mixed,
        description: String,
      },
    ],
    limits: {
      jobPostings: {
        type: Number,
        default: 0,
      },
      featuredJobs: {
        type: Number,
        default: 0,
      },
      applications: {
        type: Number,
        default: 0,
      },
      resumeDownloads: {
        type: Number,
        default: 0,
      },
      candidateSearch: {
        type: Number,
        default: 0,
      },
      teamMembers: {
        type: Number,
        default: 1,
      },
    },
    benefits: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    trialDays: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
planSchema.index({ slug: 1 });
planSchema.index({ targetAudience: 1, isActive: 1 });
planSchema.index({ order: 1 });

module.exports = mongoose.model('Plan', planSchema);
