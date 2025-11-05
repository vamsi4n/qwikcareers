const skillService = require('../services/skill.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const createSkill = catchAsync(async (req, res) => {
  const skill = await skillService.createSkill(req.body);
  ApiResponse.created(res, skill, 'Skill created successfully');
});

const getSkills = catchAsync(async (req, res) => {
  const { page, limit, ...filter } = req.query;
  const result = await skillService.getSkills(page, limit, filter);
  ApiResponse.success(res, result, 'Skills retrieved successfully');
});

const getSkillById = catchAsync(async (req, res) => {
  const skill = await skillService.getSkillById(req.params.id);
  ApiResponse.success(res, skill, 'Skill retrieved successfully');
});

const updateSkill = catchAsync(async (req, res) => {
  const skill = await skillService.updateSkill(req.params.id, req.body);
  ApiResponse.success(res, skill, 'Skill updated successfully');
});

const deleteSkill = catchAsync(async (req, res) => {
  const result = await skillService.deleteSkill(req.params.id);
  ApiResponse.success(res, result, 'Skill deleted successfully');
});

const searchSkills = catchAsync(async (req, res) => {
  const skills = await skillService.searchSkills(req.query.q);
  ApiResponse.success(res, skills, 'Skills retrieved successfully');
});

const getPopularSkills = catchAsync(async (req, res) => {
  const skills = await skillService.getPopularSkills(req.query.limit);
  ApiResponse.success(res, skills, 'Popular skills retrieved successfully');
});

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  searchSkills,
  getPopularSkills
};