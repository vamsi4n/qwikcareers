const AuditLog = require('../models/AuditLog.model');
const ModerationQueue = require('../models/ModerationQueue.model');
const User = require('../../users/models/User.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

/**
 * Admin Service
 * Handles core admin operations including audit logging, statistics, and settings validation
 */
class AdminService {
  /**
   * Log an admin action to the audit log
   *
   * @param {string} adminId - ID of the admin performing the action
   * @param {string} action - Action performed (create, update, delete, suspend, activate, approve, reject)
   * @param {string} targetType - Type of target (user, job, company, review, application, system)
   * @param {string} targetId - ID of the target entity
   * @param {Object} details - Additional details about the action
   * @param {string} ipAddress - IP address of the admin
   * @param {string} userAgent - User agent of the admin's browser
   * @returns {Promise<Object>} Created audit log entry
   * @throws {ApiError} If validation fails or database error occurs
   */
  async logAction(adminId, action, targetType, targetId, details = {}, ipAddress = null, userAgent = null) {
    try {
      // Validate admin exists
      const admin = await User.findById(adminId);
      if (!admin) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin user not found');
      }

      if (admin.role !== 'admin') {
        throw new ApiError(httpStatus.FORBIDDEN, 'User is not an admin');
      }

      // Create audit log entry
      const auditLog = await AuditLog.create({
        admin: adminId,
        action,
        targetType,
        targetId,
        details,
        ipAddress,
        userAgent,
        timestamp: new Date(),
      });

      return auditLog;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to log admin action: ${error.message}`
      );
    }
  }

  /**
   * Retrieve audit logs with optional filters and pagination
   *
   * @param {Object} filters - Filter options
   * @param {string} filters.adminId - Filter by admin ID
   * @param {string} filters.action - Filter by action type
   * @param {string} filters.targetType - Filter by target type
   * @param {Date} filters.startDate - Filter by start date
   * @param {Date} filters.endDate - Filter by end date
   * @param {number} filters.page - Page number (default: 1)
   * @param {number} filters.limit - Items per page (default: 20)
   * @returns {Promise<Object>} Paginated audit logs with metadata
   */
  async getAuditLogs(filters = {}) {
    try {
      const {
        adminId,
        action,
        targetType,
        startDate,
        endDate,
        page = 1,
        limit = 20,
      } = filters;

      // Build query
      const query = {};

      if (adminId) {
        query.admin = adminId;
      }

      if (action) {
        query.action = action;
      }

      if (targetType) {
        query.targetType = targetType;
      }

      // Date range filter
      if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) {
          query.timestamp.$gte = new Date(startDate);
        }
        if (endDate) {
          query.timestamp.$lte = new Date(endDate);
        }
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query with pagination
      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .populate('admin', 'firstName lastName email role')
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        AuditLog.countDocuments(query),
      ]);

      return {
        logs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to retrieve audit logs: ${error.message}`
      );
    }
  }

  /**
   * Get admin dashboard statistics
   *
   * @returns {Promise<Object>} Dashboard statistics
   */
  async getAdminStats() {
    try {
      // Calculate date 24 hours ago
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      // Run all queries in parallel for better performance
      const [
        totalUsers,
        totalJobSeekers,
        totalEmployers,
        totalAdmins,
        activeUsers,
        suspendedUsers,
        pendingModeration,
        recentAuditLogs,
      ] = await Promise.all([
        User.countDocuments({ isDeleted: false }),
        User.countDocuments({ role: 'jobseeker', isDeleted: false }),
        User.countDocuments({ role: 'employer', isDeleted: false }),
        User.countDocuments({ role: 'admin', isDeleted: false }),
        User.countDocuments({ isActive: true, isDeleted: false }),
        User.countDocuments({ isActive: false, isDeleted: false }),
        ModerationQueue.countDocuments({ status: 'pending' }),
        AuditLog.countDocuments({ timestamp: { $gte: twentyFourHoursAgo } }),
      ]);

      return {
        users: {
          total: totalUsers,
          byRole: {
            jobseeker: totalJobSeekers,
            employer: totalEmployers,
            admin: totalAdmins,
          },
          byStatus: {
            active: activeUsers,
            suspended: suspendedUsers,
          },
        },
        moderation: {
          pendingModeration,
        },
        auditLogs: {
          recentCount: recentAuditLogs,
          last24Hours: recentAuditLogs,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to retrieve admin statistics: ${error.message}`
      );
    }
  }

  /**
   * Validate system settings object
   *
   * @param {Object} settings - Settings object to validate
   * @returns {Object} Validation result with { valid: boolean, errors: array }
   */
  validateSettings(settings) {
    const errors = [];

    try {
      // Validate general settings
      if (settings.general) {
        const { supportEmail } = settings.general;

        // Validate support email format
        if (supportEmail) {
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
          if (!emailRegex.test(supportEmail)) {
            errors.push({
              field: 'general.supportEmail',
              message: 'Invalid support email format',
            });
          }
        }
      }

      // Validate email settings
      if (settings.email) {
        const { smtpPort, fromEmail } = settings.email;

        // Validate SMTP port range
        if (smtpPort !== undefined) {
          if (smtpPort < 1 || smtpPort > 65535) {
            errors.push({
              field: 'email.smtpPort',
              message: 'SMTP port must be between 1 and 65535',
            });
          }
        }

        // Validate from email format
        if (fromEmail) {
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
          if (!emailRegex.test(fromEmail)) {
            errors.push({
              field: 'email.fromEmail',
              message: 'Invalid from email format',
            });
          }
        }
      }

      // Validate security settings
      if (settings.security) {
        const { sessionTimeoutMinutes, passwordMinLength, apiRateLimit } = settings.security;

        // Validate session timeout
        if (sessionTimeoutMinutes !== undefined) {
          if (sessionTimeoutMinutes < 5 || sessionTimeoutMinutes > 1440) {
            errors.push({
              field: 'security.sessionTimeoutMinutes',
              message: 'Session timeout must be between 5 and 1440 minutes',
            });
          }
        }

        // Validate password minimum length
        if (passwordMinLength !== undefined) {
          if (passwordMinLength < 6 || passwordMinLength > 128) {
            errors.push({
              field: 'security.passwordMinLength',
              message: 'Password minimum length must be between 6 and 128',
            });
          }
        }

        // Validate API rate limit
        if (apiRateLimit !== undefined) {
          if (apiRateLimit < 1 || apiRateLimit > 10000) {
            errors.push({
              field: 'security.apiRateLimit',
              message: 'API rate limit must be between 1 and 10000',
            });
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [
          {
            field: 'general',
            message: `Validation error: ${error.message}`,
          },
        ],
      };
    }
  }
}

module.exports = new AdminService();
