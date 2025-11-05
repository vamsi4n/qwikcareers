const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'hr-manager', 'recruiter', 'hiring-manager'],
      default: 'recruiter',
    },
    permissions: {
      canPostJobs: {
        type: Boolean,
        default: true,
      },
      canEditJobs: {
        type: Boolean,
        default: true,
      },
      canDeleteJobs: {
        type: Boolean,
        default: false,
      },
      canViewApplications: {
        type: Boolean,
        default: true,
      },
      canManageApplications: {
        type: Boolean,
        default: true,
      },
      canAccessAnalytics: {
        type: Boolean,
        default: true,
      },
      canManageTeam: {
        type: Boolean,
        default: false,
      },
      canManageCompanyProfile: {
        type: Boolean,
        default: false,
      },
    },
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
      verificationDocuments: [
        {
          type: String,
          url: String,
          uploadedAt: Date,
        },
      ],
    },
    subscription: {
      plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
      },
      status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled', 'expired'],
        default: 'inactive',
      },
      startDate: Date,
      endDate: Date,
      autoRenew: {
        type: Boolean,
        default: true,
      },
    },
    stats: {
      totalJobsPosted: {
        type: Number,
        default: 0,
      },
      activeJobs: {
        type: Number,
        default: 0,
      },
      totalApplicationsReceived: {
        type: Number,
        default: 0,
      },
      totalHires: {
        type: Number,
        default: 0,
      },
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
employerSchema.index({ user: 1 });
employerSchema.index({ company: 1 });
employerSchema.index({ role: 1 });
employerSchema.index({ 'verification.isVerified': 1 });
employerSchema.index({ 'subscription.status': 1 });
employerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Employer', employerSchema);
