const SavedJob = require('../../../shared/models/SavedJob.model');
const JobSeeker = require('../../../shared/models/JobSeeker.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class SavedJobService {
  async saveJob(userId, jobId, notes = '') {
    // Get jobseeker profile
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    // Check if job is already saved
    const existingSave = await SavedJob.findOne({
      jobSeeker: profile._id,
      job: jobId
    });

    if (existingSave) {
      throw new ApiError(httpStatus.CONFLICT, 'Job already saved');
    }

    const savedJob = await SavedJob.create({
      jobSeeker: profile._id,
      job: jobId,
      notes
    });

    return savedJob.populate('job');
  }

  async unsaveJob(userId, jobId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const savedJob = await SavedJob.findOneAndDelete({
      jobSeeker: profile._id,
      job: jobId
    });

    if (!savedJob) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Saved job not found');
    }

    return { message: 'Job unsaved successfully' };
  }

  async getSavedJobs(userId, page = 1, limit = 20) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const skip = (page - 1) * limit;

    const savedJobs = await SavedJob.find({ jobSeeker: profile._id })
      .populate({
        path: 'job',
        populate: [
          { path: 'company' },
          { path: 'postedBy', select: 'firstName lastName' }
        ]
      })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await SavedJob.countDocuments({ jobSeeker: profile._id });

    return {
      savedJobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async updateNotes(userId, jobId, notes) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const savedJob = await SavedJob.findOneAndUpdate(
      { jobSeeker: profile._id, job: jobId },
      { $set: { notes } },
      { new: true }
    ).populate('job');

    if (!savedJob) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Saved job not found');
    }

    return savedJob;
  }

  async isJobSaved(userId, jobId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      return false;
    }

    const savedJob = await SavedJob.findOne({
      jobSeeker: profile._id,
      job: jobId
    });

    return !!savedJob;
  }
}

module.exports = new SavedJobService();
