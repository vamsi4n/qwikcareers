const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

/**
 * Middleware to require admin role for accessing protected routes
 * Checks if the authenticated user has the 'admin' role
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {ApiError} 401 if user is not authenticated
 * @throws {ApiError} 403 if user is not an admin
 */
const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authentication required. Please login to access this resource'
      );
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Access denied. Admin privileges required to access this resource'
      );
    }

    // User is authenticated and is an admin, proceed to next middleware
    next();
  } catch (error) {
    // Pass error to error handling middleware
    next(error);
  }
};

module.exports = requireAdmin;
