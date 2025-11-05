const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action');
    }

    next();
  };
};

module.exports = authorize;