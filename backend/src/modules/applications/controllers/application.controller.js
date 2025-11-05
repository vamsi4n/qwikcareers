const applicationService = require('../services/application.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');

class ApplicationController {
  applyToJob = catchAsync(async (req, res) => {
    const application = await applicationService.createApplication({
      ...req.body,
      jobSeeker: req.user.jobSeekerProfile,
    });
    ApiResponse.created(res, { application }, 'Application submitted successfully');
  });

  getApplication = catchAsync(async (req, res) => {
    const application = await applicationService.getApplicationById(req.params.id);
    ApiResponse.success(res, { application });
  });

  getMyApplications = catchAsync(async (req, res) => {
    const applications = await applicationService.getJobSeekerApplications(
      req.user.jobSeekerProfile,
      req.query
    );
    ApiResponse.success(res, { applications });
  });

  getJobApplications = catchAsync(async (req, res) => {
    const applications = await applicationService.getJobApplications(
      req.params.jobId,
      req.query
    );
    ApiResponse.success(res, { applications });
  });

  updateApplicationStatus = catchAsync(async (req, res) => {
    const { status, stage, note } = req.body;
    const application = await applicationService.updateApplicationStatus(
      req.params.id,
      status,
      stage,
      note,
      req.user.id
    );
    ApiResponse.success(res, { application }, 'Application status updated');
  });

  withdrawApplication = catchAsync(async (req, res) => {
    const application = await applicationService.withdrawApplication(
      req.params.id,
      req.user.jobSeekerProfile,
      req.body.reason
    );
    ApiResponse.success(res, { application }, 'Application withdrawn');
  });
}

module.exports = new ApplicationController();