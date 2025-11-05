const catchAsync = require('../../../shared/utils/catchAsync');
const ModerationQueue = require('../models/ModerationQueue.model');
const AuditLog = require('../models/AuditLog.model');
const Job = require('../../jobs/models/Job.model');
const CompanyReview = require('../../reviews/models/CompanyReview.model');
const InterviewReview = require('../../reviews/models/InterviewReview.model');
const SalaryReview = require('../../reviews/models/SalaryReview.model');

/**
 * Get all moderation reports with filters
 * @route GET /api/admin/moderation
 * @access Private (Admin only)
 */
exports.getModerationQueue = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    contentType,
    status,
    severity,
    search,
  } = req.query;

  // Build query
  const query = {};

  // Filter by content type
  if (contentType) {
    query.contentType = contentType;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by severity
  if (severity) {
    query.severity = severity;
  }

  // Search by reason or description
  if (search) {
    query.$or = [
      { reason: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Execute query
  const [reports, total] = await Promise.all([
    ModerationQueue.find(query)
      .populate('reportedBy', 'firstName lastName email avatar')
      .populate('reviewedBy', 'firstName lastName email avatar')
      .sort({ severity: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    ModerationQueue.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.status(200).json({
    success: true,
    data: {
      reports,
      pagination: {
        total,
        page: parseInt(page),
        pages: totalPages,
        limit: parseInt(limit),
      },
    },
    message: 'Moderation reports retrieved successfully',
  });
});

/**
 * Get single moderation report details
 * @route GET /api/admin/moderation/:reportId
 * @access Private (Admin only)
 */
exports.getModerationItemById = catchAsync(async (req, res) => {
  const { reportId } = req.params;

  const report = await ModerationQueue.findById(reportId)
    .populate('reportedBy', 'firstName lastName email avatar role')
    .populate('reviewedBy', 'firstName lastName email avatar role')
    .lean();

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Moderation report not found',
    });
  }

  // Fetch the actual content based on contentType
  let content = null;
  try {
    switch (report.contentType) {
      case 'job':
        content = await Job.findById(report.contentId).lean();
        break;
      case 'review':
        // Try to find in all review types
        content = await CompanyReview.findById(report.contentId).lean();
        if (!content) {
          content = await InterviewReview.findById(report.contentId).lean();
        }
        if (!content) {
          content = await SalaryReview.findById(report.contentId).lean();
        }
        break;
      default:
        // For message, profile, company - add when models are available
        break;
    }
  } catch (error) {
    // Content might have been deleted
    content = null;
  }

  res.status(200).json({
    success: true,
    data: {
      ...report,
      content,
    },
    message: 'Moderation report retrieved successfully',
  });
});

/**
 * Approve reported content (no violation found)
 * @route POST /api/admin/moderation/:reportId/approve
 * @access Private (Admin only)
 */
exports.approveContent = catchAsync(async (req, res) => {
  const { reportId } = req.params;
  const { resolution } = req.body;

  // Find the moderation report
  const report = await ModerationQueue.findById(reportId);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Moderation report not found',
    });
  }

  // Check if already reviewed
  if (report.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'This report has already been reviewed',
    });
  }

  // Use the model's approve method
  const adminId = req.user._id;
  await report.approve(adminId, resolution);

  // Extract request info
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create audit log
  await AuditLog.create({
    admin: adminId,
    action: 'approve',
    targetType: report.contentType,
    targetId: report.contentId,
    details: {
      reportId: report._id,
      reason: report.reason,
      severity: report.severity,
      resolution,
      action: 'approved',
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    data: report,
    message: 'Content approved successfully',
  });
});

/**
 * Reject the moderation report (false report)
 * @route POST /api/admin/moderation/:reportId/reject
 * @access Private (Admin only)
 */
exports.rejectReport = catchAsync(async (req, res) => {
  const { reportId } = req.params;
  const { resolution } = req.body;

  // Find the moderation report
  const report = await ModerationQueue.findById(reportId);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Moderation report not found',
    });
  }

  // Check if already reviewed
  if (report.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'This report has already been reviewed',
    });
  }

  // Use the model's reject method
  const adminId = req.user._id;
  await report.reject(adminId, resolution);

  // Extract request info
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create audit log
  await AuditLog.create({
    admin: adminId,
    action: 'reject',
    targetType: report.contentType,
    targetId: report.contentId,
    details: {
      reportId: report._id,
      reason: report.reason,
      severity: report.severity,
      resolution,
      action: 'rejected_report',
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    data: report,
    message: 'Report rejected successfully',
  });
});

/**
 * Remove violating content
 * @route POST /api/admin/moderation/:reportId/remove
 * @access Private (Admin only)
 */
exports.removeContent = catchAsync(async (req, res) => {
  const { reportId } = req.params;
  const { resolution } = req.body;

  // Find the moderation report
  const report = await ModerationQueue.findById(reportId);

  if (!report) {
    return res.status(404).json({
      success: false,
      message: 'Moderation report not found',
    });
  }

  // Check if already reviewed
  if (report.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'This report has already been reviewed',
    });
  }

  // Remove/flag the actual content based on type
  let contentRemoved = false;
  try {
    switch (report.contentType) {
      case 'job':
        const job = await Job.findById(report.contentId);
        if (job) {
          job.status = 'removed';
          job.isActive = false;
          await job.save();
          contentRemoved = true;
        }
        break;
      case 'review':
        // Try to remove from all review types
        let review = await CompanyReview.findById(report.contentId);
        if (!review) review = await InterviewReview.findById(report.contentId);
        if (!review) review = await SalaryReview.findById(report.contentId);

        if (review) {
          review.isApproved = false;
          review.isRemoved = true;
          await review.save();
          contentRemoved = true;
        }
        break;
      default:
        // For message, profile, company - add when models are available
        break;
    }
  } catch (error) {
    // Content might have been deleted already
    contentRemoved = false;
  }

  // Use the model's remove method
  const adminId = req.user._id;
  await report.remove(adminId, resolution);

  // Extract request info
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create audit log
  await AuditLog.create({
    admin: adminId,
    action: 'delete',
    targetType: report.contentType,
    targetId: report.contentId,
    details: {
      reportId: report._id,
      reason: report.reason,
      severity: report.severity,
      resolution,
      action: 'content_removed',
      contentRemoved,
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    data: report,
    message: contentRemoved
      ? 'Content removed successfully'
      : 'Report marked as removed (content may have been deleted already)',
  });
});

/**
 * Create new moderation report
 * @route POST /api/admin/moderation
 * @access Private (Admin only)
 */
exports.createModerationReport = catchAsync(async (req, res) => {
  const { contentType, contentId, reason, description, severity } = req.body;

  // Validate required fields
  if (!contentType || !contentId || !reason || !severity) {
    return res.status(400).json({
      success: false,
      message: 'Content type, content ID, reason, and severity are required',
    });
  }

  // Validate content type
  const validContentTypes = ['job', 'review', 'message', 'profile', 'company'];
  if (!validContentTypes.includes(contentType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid content type',
    });
  }

  // Validate severity
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(severity)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid severity level',
    });
  }

  // Create moderation report
  const report = await ModerationQueue.create({
    contentType,
    contentId,
    reportedBy: req.user._id,
    reason,
    description,
    severity,
    status: 'pending',
  });

  const populatedReport = await ModerationQueue.findById(report._id)
    .populate('reportedBy', 'firstName lastName email avatar')
    .lean();

  res.status(201).json({
    success: true,
    data: populatedReport,
    message: 'Moderation report created successfully',
  });
});
