const mongoose = require('mongoose');

/**
 * ProfileViewAnalytics Model
 * Tracks job seeker profile view statistics aggregated by day
 */
const profileViewAnalyticsSchema = new mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
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
    // Who viewed the profile (top viewers for privacy-respecting analytics)
    viewerCompanies: [
      {
        company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company',
        },
        count: Number,
      },
    ],
    // Actions taken after viewing
    resumeDownloads: {
      type: Number,
      default: 0,
    },
    contactInitiated: {
      type: Number,
      default: 0,
    },
    jobInvitations: {
      type: Number,
      default: 0,
    },
    // Profile engagement metrics
    averageTimeOnProfile: {
      type: Number, // in seconds
      default: 0,
    },
    // Source tracking
    viewSources: [
      {
        source: String, // 'search', 'job-application', 'saved-candidates', 'direct'
        count: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient time-series queries
profileViewAnalyticsSchema.index({ profile: 1, date: -1 });
profileViewAnalyticsSchema.index({ date: -1 });

// Static method to get profile views time series
profileViewAnalyticsSchema.statics.getProfileViewsTimeSeries = async function (
  profileId,
  startDate,
  endDate
) {
  return this.find({
    profile: profileId,
    date: { $gte: startDate, $lte: endDate },
  })
    .sort({ date: 1 })
    .populate('viewerCompanies.company', 'name logo')
    .lean();
};

// Static method to increment daily stats
profileViewAnalyticsSchema.statics.incrementDailyStats = async function (
  profileId,
  date,
  metrics
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const updateFields = {};
  if (metrics.views) updateFields.views = 1;
  if (metrics.uniqueViews) updateFields.uniqueViews = 1;
  if (metrics.resumeDownloads) updateFields.resumeDownloads = 1;
  if (metrics.contactInitiated) updateFields.contactInitiated = 1;
  if (metrics.jobInvitations) updateFields.jobInvitations = 1;

  return this.findOneAndUpdate(
    { profile: profileId, date: startOfDay },
    { $inc: updateFields },
    { upsert: true, new: true }
  );
};

// Static method to track company views
profileViewAnalyticsSchema.statics.trackCompanyView = async function (
  profileId,
  companyId,
  date
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  return this.findOneAndUpdate(
    {
      profile: profileId,
      date: startOfDay,
      'viewerCompanies.company': companyId,
    },
    { $inc: { 'viewerCompanies.$.count': 1 } },
    { upsert: false, new: true }
  ).then(async (result) => {
    if (!result) {
      // Company not in array, add it
      return this.findOneAndUpdate(
        { profile: profileId, date: startOfDay },
        {
          $push: {
            viewerCompanies: { company: companyId, count: 1 },
          },
          $inc: { views: 1, uniqueViews: 1 },
        },
        { upsert: true, new: true }
      );
    }
    return result;
  });
};

// Calculate application response rate
profileViewAnalyticsSchema.statics.calculateResponseRate = async function (
  profileId,
  startDate,
  endDate
) {
  const analytics = await this.find({
    profile: profileId,
    date: { $gte: startDate, $lte: endDate },
  });

  const totalViews = analytics.reduce((sum, day) => sum + day.views, 0);
  const totalContacts =
    analytics.reduce((sum, day) => sum + day.contactInitiated, 0) +
    analytics.reduce((sum, day) => sum + day.jobInvitations, 0);

  return {
    totalViews,
    totalContacts,
    responseRate: totalViews > 0 ? (totalContacts / totalViews) * 100 : 0,
  };
};

module.exports = mongoose.model(
  'ProfileViewAnalytics',
  profileViewAnalyticsSchema
);
