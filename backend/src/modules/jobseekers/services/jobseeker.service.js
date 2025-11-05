const JobSeeker = require('../../../shared/models/JobSeeker.model');
const Experience = require('../../../shared/models/Experience.model');
const Education = require('../../../shared/models/Education.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class JobSeekerService {
  async getProfile(userId) {
    const profile = await JobSeeker.findOne({ user: userId })
      .populate('user', '-password')
      .populate('skills')
      .populate('preferredCategories')
      .populate('preferredIndustries');

    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    return profile;
  }

  async createOrUpdateProfile(userId, profileData) {
    let profile = await JobSeeker.findOne({ user: userId });

    if (profile) {
      profile = await JobSeeker.findOneAndUpdate(
        { user: userId },
        { $set: profileData },
        { new: true, runValidators: true }
      )
        .populate('user', '-password')
        .populate('skills')
        .populate('preferredCategories')
        .populate('preferredIndustries');
    } else {
      profile = await JobSeeker.create({ user: userId, ...profileData });
      profile = await profile.populate('user', '-password');
    }

    // Calculate profile completeness
    await this.calculateProfileCompleteness(profile._id);

    return profile;
  }

  async calculateProfileCompleteness(profileId) {
    const profile = await JobSeeker.findById(profileId);
    if (!profile) return;

    let completeness = 0;
    const weights = {
      bio: 10,
      headline: 10,
      phone: 5,
      location: 10,
      skills: 15,
      experience: 20,
      education: 15,
      resume: 15
    };

    // Check each field
    if (profile.bio && profile.bio.length > 50) completeness += weights.bio;
    if (profile.headline) completeness += weights.headline;
    if (profile.phone) completeness += weights.phone;
    if (profile.location && profile.location.city) completeness += weights.location;
    if (profile.skills && profile.skills.length >= 3) completeness += weights.skills;

    // Check experience
    const experienceCount = await Experience.countDocuments({ jobSeeker: profileId });
    if (experienceCount > 0) completeness += weights.experience;

    // Check education
    const educationCount = await Education.countDocuments({ jobSeeker: profileId });
    if (educationCount > 0) completeness += weights.education;

    // Check resume
    if (profile.resume) completeness += weights.resume;

    profile.profileCompleteness = completeness;
    await profile.save();

    return completeness;
  }

  async addSkills(userId, skillIds) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    // Add skills that don't already exist
    const uniqueSkills = skillIds.filter(
      (skillId) => !profile.skills.includes(skillId)
    );

    profile.skills.push(...uniqueSkills);
    await profile.save();

    await this.calculateProfileCompleteness(profile._id);

    return profile.populate('skills');
  }

  async removeSkill(userId, skillId) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    profile.skills = profile.skills.filter(
      (skill) => skill.toString() !== skillId
    );
    await profile.save();

    await this.calculateProfileCompleteness(profile._id);

    return profile.populate('skills');
  }

  async updateWorkExperience(userId, updateData) {
    const profile = await JobSeeker.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'JobSeeker profile not found');
    }

    profile.workExperience = updateData;
    await profile.save();

    return profile;
  }

  async searchJobSeekers(searchParams) {
    const {
      q,
      skills,
      location,
      experienceMin,
      experienceMax,
      availability,
      page = 1,
      limit = 20
    } = searchParams;

    const skip = (page - 1) * limit;
    const query = { isProfilePublic: true };

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Skills filter
    if (skills && skills.length > 0) {
      query.skills = { $in: skills };
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } }
      ];
    }

    // Experience filter
    if (experienceMin !== undefined || experienceMax !== undefined) {
      query['workExperience.totalYears'] = {};
      if (experienceMin !== undefined) {
        query['workExperience.totalYears'].$gte = parseInt(experienceMin);
      }
      if (experienceMax !== undefined) {
        query['workExperience.totalYears'].$lte = parseInt(experienceMax);
      }
    }

    // Availability filter
    if (availability) {
      query.availability = availability;
    }

    const jobSeekers = await JobSeeker.find(query)
      .populate('user', 'firstName lastName email')
      .populate('skills')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ updatedAt: -1 });

    const total = await JobSeeker.countDocuments(query);

    return {
      jobSeekers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = new JobSeekerService();
