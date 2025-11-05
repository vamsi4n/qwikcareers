const Job = require('../models/Job.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class JobService {
  async createJob(jobData, employerId) {
    const job = await Job.create({
      ...jobData,
      postedBy: employerId,
    });
    return job;
  }

  async getJobById(jobId) {
    const job = await Job.findById(jobId)
      .populate('company')
      .populate('postedBy')
      .populate('category')
      .populate('industry')
      .populate('requirements.skills');

    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }

    // Increment view count
    job.stats.views += 1;
    await job.save();

    return job;
  }

  async getAllJobs(filter = {}, options = {}) {
    const { page = 1, limit = 20, sort = '-createdAt' } = options;

    const query = { status: 'active', ...filter };

    const jobs = await Job.find(query)
      .populate('company')
      .populate('category')
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    return {
      jobs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async updateJob(jobId, updateData, employerId) {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }

    if (job.postedBy.toString() !== employerId.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to update this job');
    }

    Object.assign(job, updateData);
    await job.save();

    return job;
  }

  async deleteJob(jobId, employerId) {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
    }

    if (job.postedBy.toString() !== employerId.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to delete this job');
    }

    await job.remove();
  }

  async searchJobs(searchParams) {
    const { q, location, jobType, workMode, category, salary, page = 1, limit = 20 } = searchParams;

    const query = { status: 'active' };

    if (q) {
      query.$text = { $search: q };
    }

    if (location) {
      query['location.city'] = new RegExp(location, 'i');
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (category) {
      query.category = category;
    }

    if (salary) {
      query['salary.min'] = { $lte: parseInt(salary) };
    }

    const jobs = await Job.find(query)
      .populate('company')
      .populate('category')
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ isFeatured: -1, createdAt: -1 });

    const total = await Job.countDocuments(query);

    return {
      jobs,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }
}

module.exports = new JobService();