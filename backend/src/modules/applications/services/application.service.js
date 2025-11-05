const Application = require('../models/Application.model');
const Job = require('../../jobs/models/Job.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class ApplicationService {
  async createApplication(applicationData) {
    const { job, jobSeeker } = applicationData;

    // Check if already applied
    const existingApplication = await Application.findOne({ job, jobSeeker });
    if (existingApplication) {
      throw new ApiError(httpStatus.CONFLICT, 'You have already applied to this job');
    }

    // Check if job exists and is active
    const jobDoc = await Job.findById(job);
    if (!jobDoc || jobDoc.status !== 'active') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Job is not available for applications');
    }

    const application = await Application.create({
      ...applicationData,
      timeline: [{
        status: 'submitted',
        stage: 'application-received',
        note: 'Application submitted',
        changedAt: new Date(),
      }],
    });

    // Update job stats
    jobDoc.stats.applications += 1;
    await jobDoc.save();

    return application;
  }

  async getApplicationById(applicationId) {
    const application = await Application.findById(applicationId)
      .populate('job')
      .populate('jobSeeker')
      .populate('resume');

    if (!application) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Application not found');
    }

    return application;
  }

  async getJobSeekerApplications(jobSeekerId, filter = {}) {
    const applications = await Application.find({ jobSeeker: jobSeekerId, ...filter })
      .populate('job')
      .populate('resume')
      .sort({ createdAt: -1 });

    return applications;
  }

  async getJobApplications(jobId, filter = {}) {
    const applications = await Application.find({ job: jobId, ...filter })
      .populate('jobSeeker')
      .populate('resume')
      .sort({ createdAt: -1 });

    return applications;
  }

  async updateApplicationStatus(applicationId, status, stage, note, userId) {
    const application = await Application.findById(applicationId);

    if (!application) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Application not found');
    }

    application.status = status;
    application.stage = stage;
    application.timeline.push({
      status,
      stage,
      note,
      changedBy: userId,
      changedAt: new Date(),
    });

    await application.save();

    return application;
  }

  async withdrawApplication(applicationId, jobSeekerId, reason) {
    const application = await Application.findById(applicationId);

    if (!application) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Application not found');
    }

    if (application.jobSeeker.toString() !== jobSeekerId.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized');
    }

    application.status = 'withdrawn';
    application.withdrawnAt = new Date();
    application.withdrawReason = reason;
    application.timeline.push({
      status: 'withdrawn',
      note: reason || 'Application withdrawn by candidate',
      changedBy: jobSeekerId,
      changedAt: new Date(),
    });

    await application.save();

    return application;
  }
}

module.exports = new ApplicationService();