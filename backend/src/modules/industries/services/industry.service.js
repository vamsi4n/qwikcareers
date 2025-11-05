const Industry = require('../../../shared/models/Industry.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class IndustryService {
  async createIndustry(industryData) {
    const existingIndustry = await Industry.findOne({ name: industryData.name });
    if (existingIndustry) {
      throw new ApiError(httpStatus.CONFLICT, 'Industry already exists');
    }

    const industry = await Industry.create(industryData);
    return industry;
  }

  async getIndustries(page = 1, limit = 50, filter = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } }
      ];
    }

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive === 'true';
    }

    const industries = await Industry.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Industry.countDocuments(query);

    return {
      industries,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async getIndustryById(industryId) {
    const industry = await Industry.findById(industryId);
    if (!industry) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Industry not found');
    }
    return industry;
  }

  async updateIndustry(industryId, updateData) {
    const industry = await Industry.findByIdAndUpdate(
      industryId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!industry) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Industry not found');
    }

    return industry;
  }

  async deleteIndustry(industryId) {
    const industry = await Industry.findByIdAndDelete(industryId);
    if (!industry) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Industry not found');
    }
    return { message: 'Industry deleted successfully' };
  }

  async searchIndustries(query) {
    const industries = await Industry.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    }).limit(20);

    return industries;
  }

  async getPopularIndustries(limit = 10) {
    const industries = await Industry.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(parseInt(limit));

    return industries;
  }
}

module.exports = new IndustryService();
