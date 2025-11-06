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

/**
 * Export audit logs as CSV
 * @route GET /api/admin/audit-logs/export/csv
 * @access Private (Admin only)
 */
exports.exportAuditLogsCsv = catchAsync(async (req, res) => {
  const AuditLog = require('../models/AuditLog.model');
  const { startDate, endDate, admin, action, targetType } = req.query;

  // Build filter query
  const filter = {};

  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) {
      filter.timestamp.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.timestamp.$lte = new Date(endDate);
    }
  }

  if (admin) {
    filter.admin = admin;
  }

  if (action) {
    filter.action = action;
  }

  if (targetType) {
    filter.targetType = targetType;
  }

  // Fetch audit logs with populated admin data
  const logs = await AuditLog.find(filter)
    .populate('admin', 'firstName lastName email')
    .sort({ timestamp: -1 })
    .lean();

  // Generate CSV content
  const csvRows = [];

  // CSV Headers
  csvRows.push([
    'Timestamp',
    'Admin Name',
    'Admin Email',
    'Action',
    'Target Type',
    'Target ID',
    'IP Address',
    'User Agent',
    'Details',
  ].join(','));

  // CSV Data Rows
  logs.forEach((log) => {
    const adminName = log.admin
      ? `${log.admin.firstName} ${log.admin.lastName}`
      : 'Unknown';
    const adminEmail = log.admin?.email || 'N/A';
    const details = log.details
      ? JSON.stringify(log.details).replace(/"/g, '""')
      : '';
    const userAgent = log.userAgent
      ? log.userAgent.replace(/"/g, '""')
      : '';

    csvRows.push([
      new Date(log.timestamp).toISOString(),
      `"${adminName}"`,
      adminEmail,
      log.action,
      log.targetType,
      log.targetId,
      log.ipAddress || '',
      `"${userAgent}"`,
      `"${details}"`,
    ].join(','));
  });

  const csvContent = csvRows.join('\n');

  // Set response headers for CSV download
  const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  res.send(csvContent);
});

/**
 * Export audit logs as PDF
 * @route GET /api/admin/audit-logs/export/pdf
 * @access Private (Admin only)
 * @requires npm install pdfkit
 */
exports.exportAuditLogsPdf = catchAsync(async (req, res) => {
  const AuditLog = require('../models/AuditLog.model');
  const { startDate, endDate, admin, action, targetType } = req.query;

  // Build filter query
  const filter = {};

  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) {
      filter.timestamp.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.timestamp.$lte = new Date(endDate);
    }
  }

  if (admin) {
    filter.admin = admin;
  }

  if (action) {
    filter.action = action;
  }

  if (targetType) {
    filter.targetType = targetType;
  }

  // Fetch audit logs with populated admin data
  const logs = await AuditLog.find(filter)
    .populate('admin', 'firstName lastName email')
    .sort({ timestamp: -1 })
    .limit(500) // Limit to 500 records for PDF
    .lean();

  try {
    // Import PDFKit (make sure to install: npm install pdfkit)
    const PDFDocument = require('pdfkit');

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'QwikCareers Audit Logs',
        Author: 'QwikCareers Admin',
        Subject: 'Admin Activity Audit Logs',
      },
    });

    // Set response headers for PDF download
    const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add header
    doc
      .fontSize(20)
      .fillColor('#1e40af')
      .text('QwikCareers Audit Logs', { align: 'center' });

    doc.moveDown();

    // Add metadata
    doc
      .fontSize(10)
      .fillColor('#6b7280')
      .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });

    if (startDate || endDate) {
      const dateRange = `Date Range: ${startDate ? new Date(startDate).toLocaleDateString() : 'All'} - ${endDate ? new Date(endDate).toLocaleDateString() : 'All'}`;
      doc.text(dateRange, { align: 'center' });
    }

    if (action || targetType || admin) {
      const filters = [];
      if (action) filters.push(`Action: ${action}`);
      if (targetType) filters.push(`Type: ${targetType}`);
      if (admin) filters.push(`Admin: ${admin}`);
      doc.text(`Filters: ${filters.join(', ')}`, { align: 'center' });
    }

    doc.moveDown();
    doc
      .fontSize(12)
      .fillColor('#374151')
      .text(`Total Records: ${logs.length}`, { align: 'center' });

    doc.moveDown(2);

    // Add table headers
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 150;
    const col3 = 250;
    const col4 = 350;
    const col5 = 450;

    doc
      .fontSize(9)
      .fillColor('#1f2937')
      .font('Helvetica-Bold')
      .text('Timestamp', col1, tableTop, { width: 90 })
      .text('Admin', col2, tableTop, { width: 90 })
      .text('Action', col3, tableTop, { width: 90 })
      .text('Target', col4, tableTop, { width: 90 })
      .text('IP', col5, tableTop, { width: 90 });

    // Draw header line
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .moveTo(col1, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .stroke();

    doc.font('Helvetica');

    // Add table rows
    let yPosition = tableTop + 25;
    const rowHeight = 40;
    const pageHeight = 750; // Leave room for page margins

    logs.forEach((log, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight) {
        doc.addPage();
        yPosition = 50;

        // Re-add headers on new page
        doc
          .fontSize(9)
          .fillColor('#1f2937')
          .font('Helvetica-Bold')
          .text('Timestamp', col1, yPosition, { width: 90 })
          .text('Admin', col2, yPosition, { width: 90 })
          .text('Action', col3, yPosition, { width: 90 })
          .text('Target', col4, yPosition, { width: 90 })
          .text('IP', col5, yPosition, { width: 90 });

        doc
          .strokeColor('#e5e7eb')
          .lineWidth(1)
          .moveTo(col1, yPosition + 15)
          .lineTo(545, yPosition + 15)
          .stroke();

        doc.font('Helvetica');
        yPosition += 25;
      }

      const timestamp = new Date(log.timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const adminName = log.admin
        ? `${log.admin.firstName} ${log.admin.lastName}`
        : 'Unknown';
      const adminEmail = log.admin?.email || '';

      doc
        .fontSize(8)
        .fillColor('#374151')
        .text(timestamp, col1, yPosition, { width: 90 })
        .text(adminName, col2, yPosition, { width: 90 })
        .text(log.action.toUpperCase(), col3, yPosition, { width: 90 })
        .text(log.targetType, col4, yPosition, { width: 90 })
        .text(log.ipAddress || 'N/A', col5, yPosition, { width: 90 });

      // Add admin email in smaller text
      doc
        .fontSize(7)
        .fillColor('#6b7280')
        .text(adminEmail, col2, yPosition + 10, { width: 90 });

      // Draw row separator
      doc
        .strokeColor('#f3f4f6')
        .lineWidth(0.5)
        .moveTo(col1, yPosition + rowHeight - 5)
        .lineTo(545, yPosition + rowHeight - 5)
        .stroke();

      yPosition += rowHeight;
    });

    // Add footer
    doc
      .fontSize(8)
      .fillColor('#9ca3af')
      .text(
        'This document is confidential and intended for authorized personnel only.',
        50,
        750,
        { align: 'center', width: 495 }
      );

    // Finalize the PDF
    doc.end();
  } catch (error) {
    // If PDFKit is not installed, return an error message
    if (error.code === 'MODULE_NOT_FOUND') {
      return res.status(500).json({
        success: false,
        message: 'PDF export functionality requires pdfkit to be installed. Run: npm install pdfkit',
        error: 'Missing dependency: pdfkit',
      });
    }
    throw error;
  }
});
