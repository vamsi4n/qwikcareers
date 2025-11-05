const employerService = require('../services/employer.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const httpStatus = require('../../../shared/constants/http-status.constants');

const getProfile = catchAsync(async (req, res) => {
  const profile = await employerService.getProfile(req.user._id);
  ApiResponse.success(res, profile, 'Employer profile retrieved successfully');
});

const createOrUpdateProfile = catchAsync(async (req, res) => {
  const profile = await employerService.createOrUpdateProfile(req.user._id, req.body);
  ApiResponse.success(res, profile, 'Employer profile saved successfully');
});

const updateCompany = catchAsync(async (req, res) => {
  const { companyId } = req.body;
  const profile = await employerService.updateCompany(req.user._id, companyId);
  ApiResponse.success(res, profile, 'Company updated successfully');
});

const updatePermissions = catchAsync(async (req, res) => {
  const profile = await employerService.updatePermissions(req.user._id, req.body);
  ApiResponse.success(res, profile, 'Permissions updated successfully');
});

const verifyEmployer = catchAsync(async (req, res) => {
  const { employerId } = req.params;
  const profile = await employerService.verifyEmployer(employerId);
  ApiResponse.success(res, profile, 'Employer verified successfully');
});

const searchEmployers = catchAsync(async (req, res) => {
  const result = await employerService.searchEmployers(req.query);
  ApiResponse.success(res, result, 'Employers retrieved successfully');
});

module.exports = {
  getProfile,
  createOrUpdateProfile,
  updateCompany,
  updatePermissions,
  verifyEmployer,
  searchEmployers
};
