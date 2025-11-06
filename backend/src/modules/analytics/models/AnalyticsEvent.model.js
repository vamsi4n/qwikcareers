const mongoose = require('mongoose');

/**
 * AnalyticsEvent Model
 * General-purpose event tracking for various analytics needs
 * Aggregated daily for time-series analysis
 */
const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        'job_view',
        'job_application',
        'job_save',
        'job_share',
        'profile_view',
        'resume_download',
        'message_sent',
        'search_performed',
        'company_view',
        'review_submitted',
        'application_status_change',
        'interview_scheduled',
        'offer_accepted',
        'offer_rejected',
        'user_registration',
        'job_posted',
        'subscription_started',
        'subscription_cancelled',
        'payment_completed',
        'payment_failed',
      ],
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    // Event count for the day
    count: {
      type: Number,
      default: 0,
    },
    // Related entities
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      sparse: true,
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true,
    },
    relatedCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      sparse: true,
    },
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
analyticsEventSchema.index({ eventType: 1, date: -1 });
analyticsEventSchema.index({ relatedJob: 1, eventType: 1, date: -1 });
analyticsEventSchema.index({ relatedUser: 1, eventType: 1, date: -1 });
analyticsEventSchema.index({ relatedCompany: 1, eventType: 1, date: -1 });

// Static method to track an event
analyticsEventSchema.statics.trackEvent = async function (
  eventType,
  date,
  relatedEntities = {}
) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const query = { eventType, date: startOfDay };
  if (relatedEntities.job) query.relatedJob = relatedEntities.job;
  if (relatedEntities.user) query.relatedUser = relatedEntities.user;
  if (relatedEntities.company) query.relatedCompany = relatedEntities.company;

  return this.findOneAndUpdate(
    query,
    {
      $inc: { count: 1 },
      $set: { metadata: relatedEntities.metadata || {} },
    },
    { upsert: true, new: true }
  );
};

// Static method to get event time series
analyticsEventSchema.statics.getEventTimeSeries = async function (
  eventType,
  startDate,
  endDate,
  filters = {}
) {
  const query = {
    eventType,
    date: { $gte: startDate, $lte: endDate },
  };

  if (filters.job) query.relatedJob = filters.job;
  if (filters.user) query.relatedUser = filters.user;
  if (filters.company) query.relatedCompany = filters.company;

  return this.find(query).sort({ date: 1 }).lean();
};

// Static method to get aggregate stats
analyticsEventSchema.statics.getAggregateStats = async function (
  eventTypes,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        eventType: { $in: eventTypes },
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$eventType',
        totalCount: { $sum: '$count' },
        dates: { $push: { date: '$date', count: '$count' } },
      },
    },
  ]);
};

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
