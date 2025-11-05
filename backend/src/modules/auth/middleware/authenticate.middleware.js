const tokenService = require('../services/token.service');
const User = require('../../users/models/User.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');
const catchAsync = require('../../../shared/utils/catchAsync');

const authenticate = catchAsync(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'No token provided');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Verify token
  const payload = tokenService.verifyAccessToken(token);

  // Get user from token
  const user = await User.findById(payload.sub);

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  if (!user.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account has been deactivated');
  }

  // Check if password was changed after token was issued
  if (user.passwordChangedAt) {
    const tokenIssuedAt = new Date(payload.iat * 1000);
    if (user.passwordChangedAt > tokenIssuedAt) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password was changed. Please login again');
    }
  }

  // Attach user to request
  req.user = user;
  next();
});

module.exports = authenticate;