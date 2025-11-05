const Company = require('../../../shared/models/Company.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class CompanyService {
  async createCompany(companyData) {
    const existingCompany = await Company.findOne({
      slug: companyData.slug
    });

    if (existingCompany) {
      throw new ApiError(httpStatus.CONFLICT, 'Company with this slug already exists');
    }

    const company = await Company.create(companyData);
    return company;
  }

  async getCompanyById(companyId) {
    const company = await Company.findById(companyId)
      .populate('industry')
      .populate('categories');

    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }

    return company;
  }

  async getCompanyBySlug(slug) {
    const company = await Company.findOne({ slug })
      .populate('industry')
      .populate('categories');

    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }

    return company;
  }

  async updateCompany(companyId, updateData) {
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate('industry')
      .populate('categories');

    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }

    return company;
  }

  async deleteCompany(companyId) {
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }
    return { message: 'Company deleted successfully' };
  }

  async verifyCompany(companyId) {
    const company = await Company.findByIdAndUpdate(
      companyId,
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date()
        }
      },
      { new: true }
    );

    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }

    return company;
  }

  async addLocation(companyId, locationData) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }

    company.locations.push(locationData);
    await company.save();

    return company;
  }

  async updateStats(companyId, stats) {
    const company = await Company.findByIdAndUpdate(
      companyId,
      { $set: { stats } },
      { new: true, runValidators: true }
    );

    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }

    return company;
  }

  async searchCompanies(searchParams) {
    const {
      q,
      industry,
      location,
      size,
      isVerified,
      page = 1,
      limit = 20
    } = searchParams;

    const skip = (page - 1) * limit;
    const query = {};

    // Text search
    if (q) {
      query.$text = { $search: q };
    }

    // Industry filter
    if (industry) {
      query.industry = industry;
    }

    // Location filter
    if (location) {
      query.$or = [
        { 'locations.city': { $regex: location, $options: 'i' } },
        { 'locations.state': { $regex: location, $options: 'i' } },
        { 'locations.country': { $regex: location, $options: 'i' } }
      ];
    }

    // Size filter
    if (size) {
      query.size = size;
    }

    // Verification filter
    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    const companies = await Company.find(query)
      .populate('industry')
      .populate('categories')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(query);

    return {
      companies,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async getFeaturedCompanies(limit = 10) {
    const companies = await Company.find({ isFeatured: true })
      .populate('industry')
      .populate('categories')
      .limit(parseInt(limit))
      .sort({ 'stats.followers': -1 });

    return companies;
  }
}

module.exports = new CompanyService();
