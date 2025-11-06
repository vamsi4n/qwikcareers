const catchAsync = require('../../../shared/utils/catchAsync');
const JobViewAnalytics = require('../models/JobViewAnalytics.model');
const ProfileViewAnalytics = require('../models/ProfileViewAnalytics.model');
const AnalyticsEvent = require('../models/AnalyticsEvent.model');

/**
 * Get job views time-series data
 * @route GET /api/v1/analytics/jobs/:jobId/views
 */
exports.getJobViewsTimeSeries = catchAsync(async (req, res) => {
  const { jobId } = req.params;
  const { startDate, endDate, period = '30days' } = req.query;

  // Calculate date range
  const end = endDate ? new Date(endDate) : new Date();
  let start;

  if (startDate) {
    start = new Date(startDate);
  } else {
    // Default date ranges based on period
    const now = new Date();
    switch (period) {
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        start = new Date(0);
        break;
    }
  }

  const timeSeries = await JobViewAnalytics.getJobViewsTimeSeries(
    jobId,
    start,
    end
  );

  // Calculate summary statistics
  const summary = {
    totalViews: timeSeries.reduce((sum, day) => sum + day.views, 0),
    totalApplications: timeSeries.reduce((sum, day) => sum + day.applications, 0),
    totalSaves: timeSeries.reduce((sum, day) => sum + day.saves, 0),
    totalShares: timeSeries.reduce((sum, day) => sum + day.shares, 0),
    averageViewsPerDay: timeSeries.length > 0
      ? Math.round(timeSeries.reduce((sum, day) => sum + day.views, 0) / timeSeries.length)
      : 0,
    conversionRate: 0,
  };

  if (summary.totalViews > 0) {
    summary.conversionRate = ((summary.totalApplications / summary.totalViews) * 100).toFixed(2);
  }

  res.status(200).json({
    success: true,
    data: {
      timeSeries,
      summary,
      period: {
        start,
        end,
      },
    },
    message: 'Job views time-series retrieved successfully',
  });
});

/**
 * Get profile views time-series data
 * @route GET /api/v1/analytics/profiles/:profileId/views
 */
exports.getProfileViewsTimeSeries = catchAsync(async (req, res) => {
  const { profileId } = req.params;
  const { startDate, endDate, period = '30days' } = req.query;

  // Calculate date range
  const end = endDate ? new Date(endDate) : new Date();
  let start;

  if (startDate) {
    start = new Date(startDate);
  } else {
    const now = new Date();
    switch (period) {
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        start = new Date(0);
        break;
    }
  }

  const timeSeries = await ProfileViewAnalytics.getProfileViewsTimeSeries(
    profileId,
    start,
    end
  );

  // Calculate response rate
  const responseRateData = await ProfileViewAnalytics.calculateResponseRate(
    profileId,
    start,
    end
  );

  // Calculate summary statistics
  const summary = {
    totalViews: timeSeries.reduce((sum, day) => sum + day.views, 0),
    totalUniqueViews: timeSeries.reduce((sum, day) => sum + day.uniqueViews, 0),
    totalResumeDownloads: timeSeries.reduce((sum, day) => sum + day.resumeDownloads, 0),
    totalContacts: timeSeries.reduce((sum, day) => sum + day.contactInitiated, 0),
    totalJobInvitations: timeSeries.reduce((sum, day) => sum + day.jobInvitations, 0),
    averageViewsPerDay: timeSeries.length > 0
      ? Math.round(timeSeries.reduce((sum, day) => sum + day.views, 0) / timeSeries.length)
      : 0,
    responseRate: responseRateData.responseRate.toFixed(2),
  };

  // Get top viewing companies
  const companyViews = {};
  timeSeries.forEach((day) => {
    day.viewerCompanies?.forEach((viewer) => {
      if (viewer.company) {
        const companyId = viewer.company._id.toString();
        if (!companyViews[companyId]) {
          companyViews[companyId] = {
            company: viewer.company,
            totalViews: 0,
          };
        }
        companyViews[companyId].totalViews += viewer.count;
      }
    });
  });

  const topCompanies = Object.values(companyViews)
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 5);

  res.status(200).json({
    success: true,
    data: {
      timeSeries,
      summary,
      topCompanies,
      period: {
        start,
        end,
      },
    },
    message: 'Profile views time-series retrieved successfully',
  });
});

/**
 * Get analytics events time-series
 * @route GET /api/v1/analytics/events
 */
exports.getEventsTimeSeries = catchAsync(async (req, res) => {
  const { eventType, startDate, endDate, period = '30days' } = req.query;

  if (!eventType) {
    return res.status(400).json({
      success: false,
      message: 'Event type is required',
    });
  }

  // Calculate date range
  const end = endDate ? new Date(endDate) : new Date();
  let start;

  if (startDate) {
    start = new Date(startDate);
  } else {
    const now = new Date();
    switch (period) {
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        start = new Date(0);
        break;
    }
  }

  const timeSeries = await AnalyticsEvent.getEventTimeSeries(
    eventType,
    start,
    end
  );

  const summary = {
    totalCount: timeSeries.reduce((sum, day) => sum + day.count, 0),
    averagePerDay: timeSeries.length > 0
      ? Math.round(timeSeries.reduce((sum, day) => sum + day.count, 0) / timeSeries.length)
      : 0,
  };

  res.status(200).json({
    success: true,
    data: {
      timeSeries,
      summary,
      period: {
        start,
        end,
      },
    },
    message: 'Analytics events time-series retrieved successfully',
  });
});

/**
 * Get multiple events aggregate statistics
 * @route GET /api/v1/analytics/events/aggregate
 */
exports.getAggregateEvents = catchAsync(async (req, res) => {
  const { eventTypes, startDate, endDate, period = '30days' } = req.query;

  if (!eventTypes) {
    return res.status(400).json({
      success: false,
      message: 'Event types are required (comma-separated)',
    });
  }

  const eventTypeArray = eventTypes.split(',').map((type) => type.trim());

  // Calculate date range
  const end = endDate ? new Date(endDate) : new Date();
  let start;

  if (startDate) {
    start = new Date(startDate);
  } else {
    const now = new Date();
    switch (period) {
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        start = new Date(0);
        break;
    }
  }

  const aggregateStats = await AnalyticsEvent.getAggregateStats(
    eventTypeArray,
    start,
    end
  );

  res.status(200).json({
    success: true,
    data: {
      events: aggregateStats,
      period: {
        start,
        end,
      },
    },
    message: 'Aggregate analytics retrieved successfully',
  });
});
