const Experience = require('../../../shared/models/Experience.model');
const JobSeeker = require('../../../shared/models/JobSeeker.model');
const jobSeekerService = require('./jobseeker.service');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class ExperienceService {
  async createExperience(userId, experienceData) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const experience = await Experience.create({
      jobSeeker: profile._id,
      ...experienceData
    });

    // Recalculate profile completeness
    await jobSeekerService.calculateProfileCompleteness(profile._id);

    return experience.populate('company');
  }

  async getExperiences(userId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const experiences = await Experience.find({ jobSeeker: profile._id })
      .populate('company')
      .sort({ startDate: -1 });

    return experiences;
  }

  async getExperienceById(userId, experienceId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const experience = await Experience.findOne({
      _id: experienceId,
      jobSeeker: profile._id
    }).populate('company');

    if (!experience) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
    }

    return experience;
  }

  async updateExperience(userId, experienceId, updateData) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const experience = await Experience.findOneAndUpdate(
      { _id: experienceId, jobSeeker: profile._id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('company');

    if (!experience) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
    }

    return experience;
  }

  async deleteExperience(userId, experienceId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const experience = await Experience.findOneAndDelete({
      _id: experienceId,
      jobSeeker: profile._id
    });

    if (!experience) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Experience not found');
    }

    // Recalculate profile completeness
    await jobSeekerService.calculateProfileCompleteness(profile._id);

    return { message: 'Experience deleted successfully' };
  }
}

module.exports = new ExperienceService();
