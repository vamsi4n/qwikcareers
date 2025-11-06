const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

/**
 * Available admin permissions
 * These match the permissions defined in the frontend
 */
const ADMIN_PERMISSIONS = {
  // User Management
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  SUSPEND_USERS: 'suspend_users',
  DELETE_USERS: 'delete_users',

  // Content Moderation
  MODERATE_CONTENT: 'moderate_content',
  VIEW_MODERATION_QUEUE: 'view_moderation_queue',
  APPROVE_CONTENT: 'approve_content',
  REMOVE_CONTENT: 'remove_content',

  // Analytics
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_ANALYTICS: 'export_analytics',

  // Settings
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_SETTINGS: 'view_settings',

  // Audit Logs
  VIEW_AUDIT_LOGS: 'view_audit_logs',

  // Job Management
  MANAGE_ALL_JOBS: 'manage_all_jobs',
  DELETE_ANY_JOB: 'delete_any_job',

  // Company Management
  MANAGE_COMPANIES: 'manage_companies',
  VERIFY_COMPANIES: 'verify_companies',

  // Reviews
  MODERATE_REVIEWS: 'moderate_reviews',
  DELETE_REVIEWS: 'delete_reviews',

  // System
  MANAGE_PERMISSIONS: 'manage_permissions',
  SYSTEM_MAINTENANCE: 'system_maintenance',
};

/**
 * Role-based permission mappings
 * Defines which permissions each role has by default
 */
const ROLE_PERMISSIONS = {
  admin: Object.values(ADMIN_PERMISSIONS), // Admins have all permissions
  moderator: [
    ADMIN_PERMISSIONS.VIEW_USERS,
    ADMIN_PERMISSIONS.MODERATE_CONTENT,
    ADMIN_PERMISSIONS.VIEW_MODERATION_QUEUE,
    ADMIN_PERMISSIONS.APPROVE_CONTENT,
    ADMIN_PERMISSIONS.REMOVE_CONTENT,
    ADMIN_PERMISSIONS.VIEW_ANALYTICS,
    ADMIN_PERMISSIONS.MODERATE_REVIEWS,
  ],
  employer: [],
  jobseeker: [],
};

/**
 * Check if a user has a specific permission
 * Checks custom permissions first, then falls back to role-based permissions
 *
 * @param {Object} user - User object with role and optional customPermissions
 * @param {string} permission - Required permission
 * @returns {boolean} Whether user has the permission
 */
const hasPermission = (user, permission) => {
  // If user has custom permissions, use those instead of role permissions
  if (user.customPermissions && Array.isArray(user.customPermissions) && user.customPermissions.length > 0) {
    return user.customPermissions.includes(permission);
  }

  // Otherwise, check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Middleware factory function that checks if the user has a specific permission
 * Supports both role-based and custom permissions
 *
 * @param {string} permission - Required permission (e.g., 'manage_users')
 * @returns {Function} Express middleware function
 *
 * @example
 * router.get('/users', authenticate, requireAdmin, checkPermission('manage_users'), getUsers);
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'Authentication required. Please login to access this resource'
        );
      }

      // Check if user is an admin or moderator (only they should access admin routes)
      if (!['admin', 'moderator'].includes(req.user.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Access denied. Admin or moderator privileges required to access this resource'
        );
      }

      // Validate permission parameter
      const validPermissions = Object.values(ADMIN_PERMISSIONS);
      if (!validPermissions.includes(permission)) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          `Invalid permission: ${permission}`
        );
      }

      // Check if user has the required permission (custom or role-based)
      if (!hasPermission(req.user, permission)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `You do not have the required permission: ${permission}`
        );
      }

      // User has the required permission, proceed to next middleware
      next();
    } catch (error) {
      // Pass error to error handling middleware
      next(error);
    }
  };
};

// Export the middleware factory function and permissions constant
module.exports = checkPermission;
module.exports.ADMIN_PERMISSIONS = ADMIN_PERMISSIONS;
