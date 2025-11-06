const mongoose = require('mongoose');

/**
 * JobViewAnalytics Model
 * Tracks job view statistics aggregated by day for time-series analytics
 */
const jobViewAnalyticsSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    // Daily aggregated metrics
    views: {
      type: Number,
      default: 0,
    },
    uniqueViews: {
      type: Number,
      default: 0,
    },
    applications: {
      type: Number,
      default: 0,
    },
    saves: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    // Conversion metrics
    viewToApplicationRate: {
      type: Number,
      default: 0,
    },
    // Geographic distribution (top 5 locations for the day)
    topLocations: [
      {
        city: String,
        country: String,
        count: Number,
      },
    ],
    // Device breakdown
    deviceBreakdown: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 },
    },
    // Referral sources
    referralSources: [
      {
        source: String, // 'direct', 'search', 'social', 'email', 'other'
        count: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient time-series queries
jobViewAnalyticsSchema.index({ job: 1, date: -1 });
jobViewAnalyticsSchema.index({ date: -1 });

// Calculate conversion rate before saving
jobViewAnalyticsSchema.pre('save', function (next) {
  if (this.views > 0) {
    this.viewToApplicationRate = (this.applications / this.views) * 100;
  }
  next();
});

// Static method to aggregate views for a job over a date range
jobViewAnalyticsSchema.statics.getJobViewsTimeSeries = async function (
  jobId,
  startDate,
  endDate
) {
  return this.find({
    job: jobId,
    date: { $gte: startDate, $lte: endDate },
  })
    .sort({ date: 1 })
    .lean();
};

// Static method to increment daily stats
jobViewAnalyticsSchema.statics.incrementDailyStats = async function (
  jobId,
  date,
  metrics
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const updateFields = {};
  if (metrics.views) updateFields.views = 1;
  if (metrics.uniqueViews) updateFields.uniqueViews = 1;
  if (metrics.applications) updateFields.applications = 1;
  if (metrics.saves) updateFields.saves = 1;
  if (metrics.shares) updateFields.shares = 1;

  return this.findOneAndUpdate(
    { job: jobId, date: startOfDay },
    { $inc: updateFields },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('JobViewAnalytics', jobViewAnalyticsSchema);
