const educationService = require('../services/education.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const httpStatus = require('../../../shared/constants/http-status.constants');

const createEducation = catchAsync(async (req, res) => {
  const education = await educationService.createEducation(req.user._id, req.body);
  ApiResponse.created(res, education, 'Education added successfully');
});

const getEducations = catchAsync(async (req, res) => {
  const educations = await educationService.getEducations(req.user._id);
  ApiResponse.success(res, educations, 'Educations retrieved successfully');
});

const getEducationById = catchAsync(async (req, res) => {
  const education = await educationService.getEducationById(req.user._id, req.params.id);
  ApiResponse.success(res, education, 'Education retrieved successfully');
});

const updateEducation = catchAsync(async (req, res) => {
  const education = await educationService.updateEducation(
    req.user._id,
    req.params.id,
    req.body
  );
  ApiResponse.success(res, education, 'Education updated successfully');
});

const deleteEducation = catchAsync(async (req, res) => {
  const result = await educationService.deleteEducation(req.user._id, req.params.id);
  ApiResponse.success(res, result, 'Education deleted successfully');
});

module.exports = {
  createEducation,
  getEducations,
  getEducationById,
  updateEducation,
  deleteEducation
};
