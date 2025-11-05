const ModerationQueue = require('../models/ModerationQueue.model');
const User = require('../../users/models/User.model');
const Job = require('../../jobs/models/Job.model');
const CompanyReview = require('../../reviews/models/CompanyReview.model');
const Message = require('../../messaging/models/Message.model');
const JobSeeker = require('../../jobseekers/models/JobSeeker.model');
const Notification = require('../../notifications/models/Notification.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

/**
 * Moderation Service
 * Handles content moderation operations including auto-flagging and notifications
 */
class ModerationService {
  /**
   * Get moderation statistics
   *
   * @returns {Promise<Object>} Moderation statistics
   */
  async getModerationStats() {
    try {
      // Run all queries in parallel for better performance
      const [
        totalReports,
        pendingReports,
        approvedReports,
        rejectedReports,
        removedReports,
        criticalReports,
        highReports,
        mediumReports,
        lowReports,
        jobReports,
        reviewReports,
        messageReports,
        profileReports,
        companyReports,
      ] = await Promise.all([
        ModerationQueue.countDocuments(),
        ModerationQueue.countDocuments({ status: 'pending' }),
        ModerationQueue.countDocuments({ status: 'approved' }),
        ModerationQueue.countDocuments({ status: 'rejected' }),
        ModerationQueue.countDocuments({ status: 'removed' }),
        ModerationQueue.countDocuments({ severity: 'critical' }),
        ModerationQueue.countDocuments({ severity: 'high' }),
        ModerationQueue.countDocuments({ severity: 'medium' }),
        ModerationQueue.countDocuments({ severity: 'low' }),
        ModerationQueue.countDocuments({ contentType: 'job' }),
        ModerationQueue.countDocuments({ contentType: 'review' }),
        ModerationQueue.countDocuments({ contentType: 'message' }),
        ModerationQueue.countDocuments({ contentType: 'profile' }),
        ModerationQueue.countDocuments({ contentType: 'company' }),
      ]);

      return {
        total: totalReports,
        byStatus: {
          pending: pendingReports,
          approved: approvedReports,
          rejected: rejectedReports,
          removed: removedReports,
        },
        bySeverity: {
          critical: criticalReports,
          high: highReports,
          medium: mediumReports,
          low: lowReports,
        },
        byContentType: {
          job: jobReports,
          review: reviewReports,
          message: messageReports,
          profile: profileReports,
          company: companyReports,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to retrieve moderation statistics: ${error.message}`
      );
    }
  }

  /**
   * Automatically flag content for moderation
   * Can be triggered by spam detection, profanity filter, or other automated systems
   *
   * @param {string} contentType - Type of content (job, review, message, profile, company)
   * @param {string} contentId - ID of the content to flag
   * @param {string} reason - Reason for flagging
   * @param {string} reportedBy - User ID who triggered the flag (optional, can be system)
   * @param {string} severity - Severity level (default: 'high')
   * @returns {Promise<Object>} Created moderation queue item
   * @throws {ApiError} If validation fails or content not found
   */
  async autoFlagContent(contentType, contentId, reason, reportedBy = null, severity = 'high') {
    try {
      // Validate content type
      const validContentTypes = ['job', 'review', 'message', 'profile', 'company'];
      if (!validContentTypes.includes(contentType)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Invalid content type. Must be one of: ${validContentTypes.join(', ')}`
        );
      }

      // Validate severity
      const validSeverities = ['low', 'medium', 'high', 'critical'];
      if (!validSeverities.includes(severity)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Invalid severity level. Must be one of: ${validSeverities.join(', ')}`
        );
      }

      // If no reporter provided, use system user (first admin or create a system flag)
      let systemReporter = reportedBy;
      if (!systemReporter) {
        const systemAdmin = await User.findOne({ role: 'admin', isActive: true }).lean();
        if (systemAdmin) {
          systemReporter = systemAdmin._id;
        } else {
          throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'No admin user found for system flagging'
          );
        }
      }

      // Check if content is already flagged and pending
      const existingReport = await ModerationQueue.findOne({
        contentType,
        contentId,
        status: 'pending',
      });

      if (existingReport) {
        // Update severity if the new flag is more severe
        const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
        if (severityLevels[severity] > severityLevels[existingReport.severity]) {
          existingReport.severity = severity;
          existingReport.description = `${existingReport.description}\n\nAdditional flag: ${reason}`;
          await existingReport.save();
        }
        return existingReport;
      }

      // Create new moderation queue entry
      const moderationItem = await ModerationQueue.create({
        contentType,
        contentId,
        reportedBy: systemReporter,
        reason: reason || 'Automatically flagged by system',
        description: `Content automatically flagged for review. Reason: ${reason}`,
        severity,
        status: 'pending',
      });

      // Notify moderators about the new flag
      await this.notifyModerators(moderationItem._id);

      return moderationItem;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to auto-flag content: ${error.message}`
      );
    }
  }

  /**
   * Send notifications to moderators about new reports
   * For now, logs to console (can be extended to send real notifications)
   *
   * @param {string} reportId - ID of the moderation report
   * @returns {Promise<Object>} Result with notification count
   */
  async notifyModerators(reportId) {
    try {
      // Fetch the report details
      const report = await ModerationQueue.findById(reportId)
        .populate('reportedBy', 'firstName lastName email')
        .lean();

      if (!report) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Moderation report not found');
      }

      // Find all active admin users
      const admins = await User.find({ role: 'admin', isActive: true }).lean();

      if (!admins || admins.length === 0) {
        console.log('No active admin users found to notify');
        return {
          success: true,
          notificationsSent: 0,
          message: 'No active admins to notify',
        };
      }

      // Create notifications for each admin
      const notificationPromises = admins.map((admin) =>
        Notification.create({
          recipient: admin._id,
          type: 'system',
          title: 'New Content Flagged for Moderation',
          message: `Content type: ${report.contentType} | Severity: ${report.severity} | Reason: ${report.reason}`,
          data: {
            reportId: report._id,
            contentType: report.contentType,
            contentId: report.contentId,
            severity: report.severity,
          },
          link: `/admin/moderation/${report._id}`,
          priority: report.severity === 'critical' || report.severity === 'high' ? 'high' : 'medium',
          channel: 'in-app',
        })
      );

      await Promise.all(notificationPromises);

      // Log to console for now (can be extended to send emails, push notifications, etc.)
      console.log(`[MODERATION] New report ${reportId} - Notified ${admins.length} moderators`);
      console.log(`[MODERATION] Content: ${report.contentType} | Severity: ${report.severity}`);
      console.log(`[MODERATION] Reason: ${report.reason}`);

      return {
        success: true,
        notificationsSent: admins.length,
        message: `Notified ${admins.length} moderators`,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Don't throw error here to prevent notification failure from breaking the flow
      console.error(`Failed to notify moderators: ${error.message}`);
      return {
        success: false,
        notificationsSent: 0,
        message: `Failed to notify moderators: ${error.message}`,
      };
    }
  }

  /**
   * Fetch content details based on content type and ID
   * Handles different model structures for different content types
   *
   * @param {string} contentType - Type of content (job, review, message, profile, company)
   * @param {string} contentId - ID of the content
   * @returns {Promise<Object|null>} Content object or null if not found
   */
  async getContentForModeration(contentType, contentId) {
    try {
      let content = null;

      switch (contentType) {
        case 'job':
          content = await Job.findById(contentId)
            .populate('company', 'name logo')
            .populate('postedBy')
            .lean();
          break;

        case 'review':
          content = await CompanyReview.findById(contentId)
            .populate('company', 'name logo')
            .populate('reviewer', 'firstName lastName email')
            .lean();
          break;

        case 'message':
          content = await Message.findById(contentId)
            .populate('sender', 'firstName lastName email')
            .populate('conversation')
            .lean();
          break;

        case 'profile':
          // Profile refers to JobSeeker profile
          content = await JobSeeker.findById(contentId)
            .populate('user', 'firstName lastName email avatar')
            .lean();
          break;

        case 'company':
          // Import Company model dynamically to avoid circular dependencies
          const Company = require('../../companies/models/Company.model');
          content = await Company.findById(contentId).lean();
          break;

        default:
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Unsupported content type: ${contentType}`
          );
      }

      return content;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to fetch content for moderation: ${error.message}`
      );
    }
  }
}

module.exports = new ModerationService();
