const companyService = require('../services/company.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const httpStatus = require('../../../shared/constants/http-status.constants');

const createCompany = catchAsync(async (req, res) => {
  const company = await companyService.createCompany(req.body);
  ApiResponse.created(res, company, 'Company created successfully');
});

const getCompanyById = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.id);
  ApiResponse.success(res, company, 'Company retrieved successfully');
});

const getCompanyBySlug = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyBySlug(req.params.slug);
  ApiResponse.success(res, company, 'Company retrieved successfully');
});

const updateCompany = catchAsync(async (req, res) => {
  const company = await companyService.updateCompany(req.params.id, req.body);
  ApiResponse.success(res, company, 'Company updated successfully');
});

const deleteCompany = catchAsync(async (req, res) => {
  const result = await companyService.deleteCompany(req.params.id);
  ApiResponse.success(res, result, 'Company deleted successfully');
});

const verifyCompany = catchAsync(async (req, res) => {
  const company = await companyService.verifyCompany(req.params.id);
  ApiResponse.success(res, company, 'Company verified successfully');
});

const addLocation = catchAsync(async (req, res) => {
  const company = await companyService.addLocation(req.params.id, req.body);
  ApiResponse.success(res, company, 'Location added successfully');
});

const updateStats = catchAsync(async (req, res) => {
  const company = await companyService.updateStats(req.params.id, req.body);
  ApiResponse.success(res, company, 'Stats updated successfully');
});

const searchCompanies = catchAsync(async (req, res) => {
  const result = await companyService.searchCompanies(req.query);
  ApiResponse.success(res, result, 'Companies retrieved successfully');
});

const getFeaturedCompanies = catchAsync(async (req, res) => {
  const companies = await companyService.getFeaturedCompanies(req.query.limit);
  ApiResponse.success(res, companies, 'Featured companies retrieved successfully');
});

module.exports = {
  createCompany,
  getCompanyById,
  getCompanyBySlug,
  updateCompany,
  deleteCompany,
  verifyCompany,
  addLocation,
  updateStats,
  searchCompanies,
  getFeaturedCompanies
};
