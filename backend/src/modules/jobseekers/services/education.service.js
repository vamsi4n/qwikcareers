const Education = require('../../../shared/models/Education.model');
const JobSeeker = require('../../../shared/models/JobSeeker.model');
const jobSeekerService = require('./jobseeker.service');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class EducationService {
  async createEducation(userId, educationData) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const education = await Education.create({
      jobSeeker: profile._id,
      ...educationData
    });

    // Recalculate profile completeness
    await jobSeekerService.calculateProfileCompleteness(profile._id);

    return education;
  }

  async getEducations(userId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const educations = await Education.find({ jobSeeker: profile._id })
      .sort({ startDate: -1 });

    return educations;
  }

  async getEducationById(userId, educationId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const education = await Education.findOne({
      _id: educationId,
      jobSeeker: profile._id
    });

    if (!education) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
    }

    return education;
  }

  async updateEducation(userId, educationId, updateData) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const education = await Education.findOneAndUpdate(
      { _id: educationId, jobSeeker: profile._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!education) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
    }

    return education;
  }

  async deleteEducation(userId, educationId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    const education = await Education.findOneAndDelete({
      _id: educationId,
      jobSeeker: profile._id
    });

    if (!education) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Education not found');
    }

    // Recalculate profile completeness
    await jobSeekerService.calculateProfileCompleteness(profile._id);

    return { message: 'Education deleted successfully' };
  }
}

module.exports = new EducationService();
