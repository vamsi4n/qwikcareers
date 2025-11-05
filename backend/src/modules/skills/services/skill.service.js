const Skill = require('../../../shared/models/Skill.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class SkillService {
  async createSkill(skillData) {
    const existingSkill = await Skill.findOne({ name: skillData.name });
    if (existingSkill) {
      throw new ApiError(httpStatus.CONFLICT, 'Skill already exists');
    }

    const skill = await Skill.create(skillData);
    return skill.populate('category');
  }

  async getSkills(page = 1, limit = 50, filter = {}) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filter.category) {
      query.category = filter.category;
    }

    if (filter.search) {
      query.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } }
      ];
    }

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive === 'true';
    }

    const skills = await Skill.find(query)
      .populate('category')
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Skill.countDocuments(query);

    return {
      skills,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }

  async getSkillById(skillId) {
    const skill = await Skill.findById(skillId).populate('category');
    if (!skill) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
    }
    return skill;
  }

  async updateSkill(skillId, updateData) {
    const skill = await Skill.findByIdAndUpdate(
      skillId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category');

    if (!skill) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
    }

    return skill;
  }

  async deleteSkill(skillId) {
    const skill = await Skill.findByIdAndDelete(skillId);
    if (!skill) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Skill not found');
    }
    return { message: 'Skill deleted successfully' };
  }

  async searchSkills(query) {
    const skills = await Skill.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { aliases: { $in: [new RegExp(query, 'i')] } }
      ],
      isActive: true
    })
      .populate('category')
      .limit(20)
      .sort({ popularity: -1 });

    return skills;
  }

  async getPopularSkills(limit = 20) {
    const skills = await Skill.find({ isActive: true })
      .populate('category')
      .sort({ popularity: -1 })
      .limit(parseInt(limit));

    return skills;
  }

  async incrementPopularity(skillId) {
    await Skill.findByIdAndUpdate(skillId, {
      $inc: { popularity: 1 }
    });
  }
}

module.exports = new SkillService();
