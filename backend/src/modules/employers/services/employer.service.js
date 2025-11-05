const Employer = require('../../../shared/models/Employer.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class EmployerService {
  async getProfile(userId) {
    const profile = await Employer.findOne({ user: userId })
      .populate('user', '-password')
      .populate('company')
      .populate('subscription');

    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Employer profile not found');
    }

    return profile;
  }

  async createOrUpdateProfile(userId, profileData) {
    let profile = await Employer.findOne({ user: userId });

    if (profile) {
      profile = await Employer.findOneAndUpdate(
        { user: userId },
        { $set: profileData },
        { new: true, runValidators: true }
      )
        .populate('user', '-password')
        .populate('company')
        .populate('subscription');
    } else {
      profile = await Employer.create({ user: userId, ...profileData });
      profile = await profile.populate(['user', 'company', 'subscription']);
    }

    return profile;
  }

  async updateCompany(userId, companyId) {
    const profile = await Employer.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Employer profile not found');
    }

    profile.company = companyId;
    await profile.save();

    return profile.populate(['user', 'company', 'subscription']);
  }

  async updatePermissions(userId, permissions) {
    const profile = await Employer.findOne({ user: userId });
    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Employer profile not found');
    }

    profile.permissions = permissions;
    await profile.save();

    return profile.populate(['user', 'company', 'subscription']);
  }

  async verifyEmployer(employerId) {
    const profile = await Employer.findByIdAndUpdate(
      employerId,
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date()
        }
      },
      { new: true }
    ).populate(['user', 'company', 'subscription']);

    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Employer not found');
    }

    return profile;
  }

  async searchEmployers(searchParams) {
    const { q, company, isVerified, page = 1, limit = 20 } = searchParams;
    const skip = (page - 1) * limit;

    const query = {};

    if (q) {
      query.$or = [
        { designation: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } }
      ];
    }

    if (company) {
      query.company = company;
    }

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    const employers = await Employer.find(query)
      .populate('user', 'firstName lastName email')
      .populate('company')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Employer.countDocuments(query);

    return {
      employers,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = new EmployerService();
