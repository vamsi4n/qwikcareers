const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/http-status.constants');

const notFound = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Route not found'));
};

module.exports = notFound;