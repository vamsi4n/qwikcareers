const mongoose = require('mongoose');

const moderationQueueSchema = new mongoose.Schema(
  {
    contentType: {
      type: String,
      enum: {
        values: ['job', 'review', 'message', 'profile', 'company'],
        message: '{VALUE} is not a valid content type',
      },
      required: [true, 'Content type is required'],
      index: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Content ID is required'],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter user is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
      maxlength: [200, 'Reason cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'removed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
      index: true,
    },
    severity: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not a valid severity level',
      },
      required: [true, 'Severity is required'],
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    resolution: {
      type: String,
      trim: true,
      maxlength: [1000, 'Resolution cannot exceed 1000 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Using custom timestamp fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for common queries
moderationQueueSchema.index({ status: 1, severity: -1, createdAt: -1 });
moderationQueueSchema.index({ contentType: 1, status: 1 });
moderationQueueSchema.index({ contentType: 1, contentId: 1 });
moderationQueueSchema.index({ reportedBy: 1, createdAt: -1 });

// Virtual populate for reportedBy user details
moderationQueueSchema.virtual('reporter', {
  ref: 'User',
  localField: 'reportedBy',
  foreignField: '_id',
  justOne: true,
});

// Virtual populate for reviewedBy user details
moderationQueueSchema.virtual('reviewer', {
  ref: 'User',
  localField: 'reviewedBy',
  foreignField: '_id',
  justOne: true,
});

// Instance method to approve content
moderationQueueSchema.methods.approve = async function (reviewerId, resolution = '') {
  this.status = 'approved';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.resolution = resolution || 'Content approved after review';
  this.updatedAt = new Date();

  return await this.save();
};

// Instance method to reject report
moderationQueueSchema.methods.reject = async function (reviewerId, resolution = '') {
  this.status = 'rejected';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.resolution = resolution || 'Report rejected - no violation found';
  this.updatedAt = new Date();

  return await this.save();
};

// Instance method to remove content
moderationQueueSchema.methods.remove = async function (reviewerId, resolution = '') {
  this.status = 'removed';
  this.reviewedBy = reviewerId;
  this.reviewedAt = new Date();
  this.resolution = resolution || 'Content removed due to violation';
  this.updatedAt = new Date();

  return await this.save();
};

// Update the updatedAt timestamp before saving
moderationQueueSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ModerationQueue', moderationQueueSchema);
