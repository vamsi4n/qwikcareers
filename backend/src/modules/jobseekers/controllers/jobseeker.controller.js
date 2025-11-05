const jobSeekerService = require('../services/jobseeker.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const httpStatus = require('../../../shared/constants/http-status.constants');

const getProfile = catchAsync(async (req, res) => {
  const profile = await jobSeekerService.getProfile(req.user._id);
  ApiResponse.success(res, profile, 'JobSeeker profile retrieved successfully');
});

const createOrUpdateProfile = catchAsync(async (req, res) => {
  const profile = await jobSeekerService.createOrUpdateProfile(req.user._id, req.body);
  ApiResponse.success(res, profile, 'JobSeeker profile saved successfully');
});

const addSkills = catchAsync(async (req, res) => {
  const { skillIds } = req.body;
  const profile = await jobSeekerService.addSkills(req.user._id, skillIds);
  ApiResponse.success(res, profile, 'Skills added successfully');
});

const removeSkill = catchAsync(async (req, res) => {
  const { skillId } = req.params;
  const profile = await jobSeekerService.removeSkill(req.user._id, skillId);
  ApiResponse.success(res, profile, 'Skill removed successfully');
});

const updateWorkExperience = catchAsync(async (req, res) => {
  const profile = await jobSeekerService.updateWorkExperience(req.user._id, req.body);
  ApiResponse.success(res, profile, 'Work experience updated successfully');
});

const searchJobSeekers = catchAsync(async (req, res) => {
  const result = await jobSeekerService.searchJobSeekers(req.query);
  ApiResponse.success(res, result, 'JobSeekers retrieved successfully');
});

module.exports = {
  getProfile,
  createOrUpdateProfile,
  addSkills,
  removeSkill,
  updateWorkExperience,
  searchJobSeekers
};
