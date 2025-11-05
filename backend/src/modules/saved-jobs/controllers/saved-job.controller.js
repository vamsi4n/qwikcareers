const savedJobService = require('../services/saved-job.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

const saveJob = catchAsync(async (req, res) => {
  const { jobId, notes } = req.body;
  const savedJob = await savedJobService.saveJob(req.user._id, jobId, notes);
  ApiResponse.created(res, savedJob, 'Job saved successfully');
});

const unsaveJob = catchAsync(async (req, res) => {
  const result = await savedJobService.unsaveJob(req.user._id, req.params.jobId);
  ApiResponse.success(res, result, 'Job unsaved successfully');
});

const getSavedJobs = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const result = await savedJobService.getSavedJobs(req.user._id, page, limit);
  ApiResponse.success(res, result, 'Saved jobs retrieved successfully');
});

const updateNotes = catchAsync(async (req, res) => {
  const { notes } = req.body;
  const savedJob = await savedJobService.updateNotes(req.user._id, req.params.jobId, notes);
  ApiResponse.success(res, savedJob, 'Notes updated successfully');
});

const checkIfSaved = catchAsync(async (req, res) => {
  const isSaved = await savedJobService.isJobSaved(req.user._id, req.params.jobId);
  ApiResponse.success(res, { isSaved }, 'Status retrieved successfully');
});

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
  updateNotes,
  checkIfSaved
};
