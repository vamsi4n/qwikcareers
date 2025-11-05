const industryService = require('../services/industry.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const createIndustry = catchAsync(async (req, res) => {
  const industry = await industryService.createIndustry(req.body);
  ApiResponse.created(res, industry, 'Industry created successfully');
});

const getIndustries = catchAsync(async (req, res) => {
  const { page, limit, ...filter } = req.query;
  const result = await industryService.getIndustries(page, limit, filter);
  ApiResponse.success(res, result, 'Industries retrieved successfully');
});

const getIndustryById = catchAsync(async (req, res) => {
  const industry = await industryService.getIndustryById(req.params.id);
  ApiResponse.success(res, industry, 'Industry retrieved successfully');
});

const updateIndustry = catchAsync(async (req, res) => {
  const industry = await industryService.updateIndustry(req.params.id, req.body);
  ApiResponse.success(res, industry, 'Industry updated successfully');
});

const deleteIndustry = catchAsync(async (req, res) => {
  const result = await industryService.deleteIndustry(req.params.id);
  ApiResponse.success(res, result, 'Industry deleted successfully');
});

const searchIndustries = catchAsync(async (req, res) => {
  const industries = await industryService.searchIndustries(req.query.q);
  ApiResponse.success(res, industries, 'Industries retrieved successfully');
});

const getPopularIndustries = catchAsync(async (req, res) => {
  const industries = await industryService.getPopularIndustries(req.query.limit);
  ApiResponse.success(res, industries, 'Popular industries retrieved successfully');
});

module.exports = {
  createIndustry,
  getIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry,
  searchIndustries,
  getPopularIndustries
};