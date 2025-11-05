const categoryService = require('../services/category.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  ApiResponse.created(res, category, 'Category created successfully');
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories(req.query);
  ApiResponse.success(res, categories, 'Categories retrieved successfully');
});

const getCategoryById = catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  ApiResponse.success(res, category, 'Category retrieved successfully');
});

const getCategoryTree = catchAsync(async (req, res) => {
  const tree = await categoryService.getCategoryTree();
  ApiResponse.success(res, tree, 'Category tree retrieved successfully');
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  ApiResponse.success(res, category, 'Category updated successfully');
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  ApiResponse.success(res, result, 'Category deleted successfully');
});

const searchCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.searchCategories(req.query.q);
  ApiResponse.success(res, categories, 'Categories retrieved successfully');
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryTree,
  updateCategory,
  deleteCategory,
  searchCategories
};