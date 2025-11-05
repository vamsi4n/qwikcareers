const jobService = require('../services/job.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

class JobController {
  createJob = catchAsync(async (req, res) => {
    const job = await jobService.createJob(req.body, req.user.id);
    ApiResponse.created(res, { job }, 'Job created successfully');
  });

  getJob = catchAsync(async (req, res) => {
    const job = await jobService.getJobById(req.params.id);
    ApiResponse.success(res, { job });
  });

  getAllJobs = catchAsync(async (req, res) => {
    const result = await jobService.getAllJobs(req.query, req.query);
    ApiResponse.success(res, result);
  });

  searchJobs = catchAsync(async (req, res) => {
    const result = await jobService.searchJobs(req.query);
    ApiResponse.success(res, result);
  });

  updateJob = catchAsync(async (req, res) => {
    const job = await jobService.updateJob(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { job }, 'Job updated successfully');
  });

  deleteJob = catchAsync(async (req, res) => {
    await jobService.deleteJob(req.params.id, req.user.id);
    ApiResponse.success(res, null, 'Job deleted successfully');
  });
}

module.exports = new JobController();