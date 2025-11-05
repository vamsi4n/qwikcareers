const experienceService = require('../services/experience.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const httpStatus = require('../../../shared/constants/http-status.constants');

const createExperience = catchAsync(async (req, res) => {
  const experience = await experienceService.createExperience(req.user._id, req.body);
  ApiResponse.created(res, experience, 'Experience added successfully');
});

const getExperiences = catchAsync(async (req, res) => {
  const experiences = await experienceService.getExperiences(req.user._id);
  ApiResponse.success(res, experiences, 'Experiences retrieved successfully');
});

const getExperienceById = catchAsync(async (req, res) => {
  const experience = await experienceService.getExperienceById(req.user._id, req.params.id);
  ApiResponse.success(res, experience, 'Experience retrieved successfully');
});

const updateExperience = catchAsync(async (req, res) => {
  const experience = await experienceService.updateExperience(
    req.user._id,
    req.params.id,
    req.body
  );
  ApiResponse.success(res, experience, 'Experience updated successfully');
});

const deleteExperience = catchAsync(async (req, res) => {
  const result = await experienceService.deleteExperience(req.user._id, req.params.id);
  ApiResponse.success(res, result, 'Experience deleted successfully');
});

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience
};
