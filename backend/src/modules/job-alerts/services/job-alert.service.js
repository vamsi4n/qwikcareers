const JobAlert = require('../../../shared/models/JobAlert.model');
const JobSeeker = require('../../../shared/models/JobSeeker.model');
const Job = require('../../../shared/models/Job.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class JobAlertService {
  async createAlert(userId, alertData) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const alert = await JobAlert.create({
      jobSeeker: profile._id,
      ...alertData
    });

    return alert.populate(['categories', 'industries', 'skills', 'companies']);
  }

  async getAlerts(userId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const alerts = await JobAlert.find({ jobSeeker: profile._id })
      .populate(['categories', 'industries', 'skills', 'companies'])
      .sort({ createdAt: -1 });

    return alerts;
  }

  async getAlertById(userId, alertId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const alert = await JobAlert.findOne({
      _id: alertId,
      jobSeeker: profile._id
    }).populate(['categories', 'industries', 'skills', 'companies']);

    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job alert not found');
    }

    return alert;
  }

  async updateAlert(userId, alertId, updateData) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const alert = await JobAlert.findOneAndUpdate(
      { _id: alertId, jobSeeker: profile._id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate(['categories', 'industries', 'skills', 'companies']);

    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job alert not found');
    }

    return alert;
  }

  async deleteAlert(userId, alertId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const alert = await JobAlert.findOneAndDelete({
      _id: alertId,
      jobSeeker: profile._id
    });

    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job alert not found');
    }

    return { message: 'Job alert deleted successfully' };
  }

  async toggleAlert(userId, alertId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const alert = await JobAlert.findOne({
      _id: alertId,
      jobSeeker: profile._id
    });

    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job alert not found');
    }

    alert.isActive = !alert.isActive;
    await alert.save();

    return alert.populate(['categories', 'industries', 'skills', 'companies']);
  }

  async findMatchingJobs(alertId) {
    const alert = await JobAlert.findById(alertId);
    if (!alert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Job alert not found');
    }

    const query = { status: 'active' };

    // Keywords search
    if (alert.criteria.keywords && alert.criteria.keywords.length > 0) {
      query.$text = { $search: alert.criteria.keywords.join(' ') };
    }

    // Location filter
    if (alert.criteria.location) {
      const { city, state, country } = alert.criteria.location;
      const locationConditions = [];
      if (city) locationConditions.push({ 'location.city': city });
      if (state) locationConditions.push({ 'location.state': state });
      if (country) locationConditions.push({ 'location.country': country });
      if (locationConditions.length > 0) {
        query.$or = locationConditions;
      }
    }

    // Job types filter
    if (alert.criteria.jobTypes && alert.criteria.jobTypes.length > 0) {
      query.jobType = { $in: alert.criteria.jobTypes };
    }

    // Work modes filter
    if (alert.criteria.workModes && alert.criteria.workModes.length > 0) {
      query.workMode = { $in: alert.criteria.workModes };
    }

    // Categories filter
    if (alert.criteria.categories && alert.criteria.categories.length > 0) {
      query.category = { $in: alert.criteria.categories };
    }

    // Skills filter
    if (alert.criteria.skills && alert.criteria.skills.length > 0) {
      query['requirements.skills'] = { $in: alert.criteria.skills };
    }

    // Experience filter
    if (alert.criteria.experienceLevel) {
      const { min, max } = alert.criteria.experienceLevel;
      if (min !== undefined || max !== undefined) {
        query['requirements.experience.min'] = {};
        if (min !== undefined) {
          query['requirements.experience.min'].$lte = min;
        }
        if (max !== undefined) {
          query['requirements.experience.max'] = { $gte: max };
        }
      }
    }

    // Salary filter
    if (alert.criteria.salary && (alert.criteria.salary.min || alert.criteria.salary.max)) {
      query['salary.min'] = {};
      if (alert.criteria.salary.min) {
        query['salary.min'].$gte = alert.criteria.salary.min;
      }
      if (alert.criteria.salary.max) {
        query['salary.max'] = { $lte: alert.criteria.salary.max };
      }
    }

    // Companies filter
    if (alert.criteria.companies && alert.criteria.companies.length > 0) {
      query.company = { $in: alert.criteria.companies };
    }

    // Find only jobs created after last sent date
    if (alert.lastSentAt) {
      query.createdAt = { $gt: alert.lastSentAt };
    }

    const jobs = await Job.find(query)
      .populate('company')
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(50);

    // Update match count and last sent date
    alert.matchCount = jobs.length;
    alert.lastSentAt = new Date();
    await alert.save();

    return jobs;
  }
}

module.exports = new JobAlertService();
