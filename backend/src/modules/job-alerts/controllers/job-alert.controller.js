const jobAlertService = require('../services/job-alert.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const createAlert = catchAsync(async (req, res) => {
  const alert = await jobAlertService.createAlert(req.user._id, req.body);
  ApiResponse.created(res, alert, 'Job alert created successfully');
});

const getAlerts = catchAsync(async (req, res) => {
  const alerts = await jobAlertService.getAlerts(req.user._id);
  ApiResponse.success(res, alerts, 'Job alerts retrieved successfully');
});

const getAlertById = catchAsync(async (req, res) => {
  const alert = await jobAlertService.getAlertById(req.user._id, req.params.id);
  ApiResponse.success(res, alert, 'Job alert retrieved successfully');
});

const updateAlert = catchAsync(async (req, res) => {
  const alert = await jobAlertService.updateAlert(req.user._id, req.params.id, req.body);
  ApiResponse.success(res, alert, 'Job alert updated successfully');
});

const deleteAlert = catchAsync(async (req, res) => {
  const result = await jobAlertService.deleteAlert(req.user._id, req.params.id);
  ApiResponse.success(res, result, 'Job alert deleted successfully');
});

const toggleAlert = catchAsync(async (req, res) => {
  const alert = await jobAlertService.toggleAlert(req.user._id, req.params.id);
  ApiResponse.success(res, alert, 'Job alert status toggled successfully');
});

const findMatchingJobs = catchAsync(async (req, res) => {
  const jobs = await jobAlertService.findMatchingJobs(req.params.id);
  ApiResponse.success(res, jobs, 'Matching jobs retrieved successfully');
});

module.exports = {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
  toggleAlert,
  findMatchingJobs
};
