const userService = require('../services/user.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const httpStatus = require('../../../shared/constants/http-status.constants');

const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  ApiResponse.success(res, user, 'Profile retrieved successfully');
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  ApiResponse.success(res, user, 'Profile updated successfully');
});

const updateEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await userService.updateEmail(req.user._id, email);
  ApiResponse.success(res, user, 'Email updated successfully. Please verify your new email.');
});

const updatePreferences = catchAsync(async (req, res) => {
  const user = await userService.updatePreferences(req.user._id, req.body);
  ApiResponse.success(res, user, 'Preferences updated successfully');
});

const deactivateAccount = catchAsync(async (req, res) => {
  const user = await userService.deactivateAccount(req.user._id);
  ApiResponse.success(res, user, 'Account deactivated successfully');
});

const deleteAccount = catchAsync(async (req, res) => {
  const result = await userService.deleteAccount(req.user._id);
  ApiResponse.success(res, result, 'Account deleted successfully');
});

const searchUsers = catchAsync(async (req, res) => {
  const result = await userService.searchUsers(req.query);
  ApiResponse.success(res, result, 'Users retrieved successfully');
});

module.exports = {
  getProfile,
  updateProfile,
  updateEmail,
  updatePreferences,
  deactivateAccount,
  deleteAccount,
  searchUsers
};
