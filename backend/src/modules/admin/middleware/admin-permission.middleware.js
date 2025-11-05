const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

/**
 * Available admin permissions
 * These can be extended in the future to support granular access control
 */
const ADMIN_PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_CONTENT: 'manage_content',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_ANALYTICS: 'view_analytics',
  MODERATE_CONTENT: 'moderate_content',
};

/**
 * Middleware factory function that checks if the admin has a specific permission
 * Currently, all admins have all permissions, but this can be extended to support
 * role-based permissions or permission-based access control
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

      // Check if user is an admin
      if (req.user.role !== 'admin') {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Access denied. Admin privileges required to access this resource'
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

      // Check if admin has the required permission
      // For now, all admins have all permissions
      // In the future, you can extend this to check admin.permissions array
      // or implement role-based access control
      const hasPermission = true; // All admins have all permissions for now

      if (!hasPermission) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `You do not have the required permission: ${permission}`
        );
      }

      // Admin has the required permission, proceed to next middleware
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
