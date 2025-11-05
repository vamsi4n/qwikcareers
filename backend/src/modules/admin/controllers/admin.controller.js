const catchAsync = require('../../../shared/utils/catchAsync');
const User = require('../../users/models/User.model');
const Job = require('../../jobs/models/Job.model');
const Application = require('../../applications/models/Application.model');
const Company = require('../../companies/models/Company.model');
const adminService = require('../services/admin.service');

/**
 * Helper function to calculate period dates
 */
const getPeriodDates = (period) => {
  const now = new Date();
  let startDate, previousStartDate, previousEndDate;

  switch (period) {
    case '7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      previousEndDate = startDate;
      break;
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      previousStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
      previousEndDate = startDate;
      break;
    case '90days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      previousStartDate = new Date(startDate.getTime() - 90 * 24 * 60 * 60 * 1000);
      previousEndDate = startDate;
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
      previousStartDate = new Date(0);
      previousEndDate = new Date(0);
      break;
  }

  return { startDate, previousStartDate, previousEndDate, now };
};

/**
 * Helper function to calculate growth percentage
 */
const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Get platform-wide statistics
 * @route GET /api/admin/analytics/platform
 * @access Private (Admin only)
 */
exports.getPlatformAnalytics = catchAsync(async (req, res) => {
  const { period = '30days' } = req.query;

  const { startDate, previousStartDate, previousEndDate, now } = getPeriodDates(period);

  // Get current period counts
  const [
    totalUsers,
    currentPeriodUsers,
    previousPeriodUsers,
    totalJobs,
    currentPeriodJobs,
    previousPeriodJobs,
    totalApplications,
    currentPeriodApplications,
    previousPeriodApplications,
    totalCompanies,
    currentPeriodCompanies,
    previousPeriodCompanies,
  ] = await Promise.all([
    // Total users
    User.countDocuments({ isDeleted: false }),
    // Current period users
    User.countDocuments({
      isDeleted: false,
      createdAt: { $gte: startDate, $lte: now },
    }),
    // Previous period users
    User.countDocuments({
      isDeleted: false,
      createdAt: { $gte: previousStartDate, $lt: previousEndDate },
    }),
    // Total jobs
    Job.countDocuments(),
    // Current period jobs
    Job.countDocuments({
      createdAt: { $gte: startDate, $lte: now },
    }),
    // Previous period jobs
    Job.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: previousEndDate },
    }),
    // Total applications
    Application.countDocuments(),
    // Current period applications
    Application.countDocuments({
      createdAt: { $gte: startDate, $lte: now },
    }),
    // Previous period applications
    Application.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: previousEndDate },
    }),
    // Total companies
    Company.countDocuments(),
    // Current period companies
    Company.countDocuments({
      createdAt: { $gte: startDate, $lte: now },
    }),
    // Previous period companies
    Company.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: previousEndDate },
    }),
  ]);

  // Calculate growth percentages
  const userGrowth = calculateGrowth(currentPeriodUsers, previousPeriodUsers);
  const jobGrowth = calculateGrowth(currentPeriodJobs, previousPeriodJobs);
  const applicationGrowth = calculateGrowth(currentPeriodApplications, previousPeriodApplications);
  const companyGrowth = calculateGrowth(currentPeriodCompanies, previousPeriodCompanies);

  res.status(200).json({
    success: true,
    data: {
      period,
      totalCounts: {
        users: totalUsers,
        jobs: totalJobs,
        applications: totalApplications,
        companies: totalCompanies,
      },
      currentPeriod: {
        users: currentPeriodUsers,
        jobs: currentPeriodJobs,
        applications: currentPeriodApplications,
        companies: currentPeriodCompanies,
      },
      growth: {
        users: userGrowth,
        jobs: jobGrowth,
        applications: applicationGrowth,
        companies: companyGrowth,
      },
      startDate,
      endDate: now,
    },
    message: 'Platform analytics retrieved successfully',
  });
});

/**
 * Get user-related analytics
 * @route GET /api/admin/analytics/users
 * @access Private (Admin only)
 */
exports.getUserAnalytics = catchAsync(async (req, res) => {
  const { period = '30days' } = req.query;

  const { startDate, now } = getPeriodDates(period);

  // Get user statistics
  const [totalUsers, activeUsers, usersByRole, recentUsers] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    User.countDocuments({
      isDeleted: false,
      isActive: true,
      lastLogin: { $gte: startDate },
    }),
    User.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]),
    User.find({ isDeleted: false, createdAt: { $gte: startDate } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName email role createdAt')
      .lean(),
  ]);

  // User registrations over time (grouped by day)
  const userRegistrations = await User.aggregate([
    {
      $match: {
        isDeleted: false,
        createdAt: { $gte: startDate, $lte: now },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format usersByRole
  const roleStats = usersByRole.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      period,
      totalUsers,
      activeUsers,
      usersByRole: roleStats,
      registrationsOverTime: userRegistrations,
      recentUsers,
      startDate,
      endDate: now,
    },
    message: 'User analytics retrieved successfully',
  });
});

/**
 * Get job-related analytics
 * @route GET /api/admin/analytics/jobs
 * @access Private (Admin only)
 */
exports.getJobAnalytics = catchAsync(async (req, res) => {
  const { period = '30days' } = req.query;

  const { startDate, now } = getPeriodDates(period);

  // Get job statistics
  const [
    totalJobs,
    activeJobs,
    jobPostingsOverTime,
    jobsByCategory,
    jobsByType,
    applicationsPerJob,
  ] = await Promise.all([
    Job.countDocuments(),
    Job.countDocuments({ isActive: true, status: 'active' }),
    // Job postings over time
    Job.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    // Jobs by category
    Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    // Jobs by type
    Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$employmentType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    // Average applications per job
    Application.aggregate([
      {
        $group: {
          _id: '$job',
          applicationCount: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          averageApplications: { $avg: '$applicationCount' },
        },
      },
    ]),
  ]);

  // Get top categories
  const topCategories = jobsByCategory.map((cat) => ({
    category: cat._id,
    count: cat.count,
  }));

  // Format jobs by type
  const jobTypeStats = jobsByType.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const avgApplicationsPerJob =
    applicationsPerJob.length > 0
      ? Math.round(applicationsPerJob[0].averageApplications * 10) / 10
      : 0;

  res.status(200).json({
    success: true,
    data: {
      period,
      totalJobs,
      activeJobs,
      jobPostingsOverTime,
      topCategories,
      jobsByType: jobTypeStats,
      averageApplicationsPerJob: avgApplicationsPerJob,
      startDate,
      endDate: now,
    },
    message: 'Job analytics retrieved successfully',
  });
});

/**
 * Get recent platform activity
 * @route GET /api/admin/analytics/recent-activity
 * @access Private (Admin only)
 */
exports.getRecentActivity = catchAsync(async (req, res) => {
  const { limit = 10 } = req.query;

  const limitNum = parseInt(limit);

  // Get recent activity across different entities
  const [recentUsers, recentJobs, recentApplications] = await Promise.all([
    User.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .select('firstName lastName email role createdAt')
      .lean(),
    Job.find()
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .select('title company location employmentType createdAt')
      .populate('company', 'name logo')
      .lean(),
    Application.find()
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .select('status createdAt')
      .populate('applicant', 'firstName lastName email')
      .populate('job', 'title company')
      .lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      recentUsers,
      recentJobs,
      recentApplications,
    },
    message: 'Recent activity retrieved successfully',
  });
});

/**
 * Get audit logs with filters and pagination
 * @route GET /api/admin/audit-logs
 * @access Private (Admin only)
 */
exports.getAuditLogs = catchAsync(async (req, res) => {
  const logs = await adminService.getAuditLogs(req.query);

  res.status(200).json({
    success: true,
    data: logs,
    message: 'Audit logs retrieved successfully',
  });
});
