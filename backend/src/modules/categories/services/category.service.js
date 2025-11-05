const Category = require('../../../shared/models/Category.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class CategoryService {
  async createCategory(categoryData) {
    const existingCategory = await Category.findOne({ name: categoryData.name });
    if (existingCategory) {
      throw new ApiError(httpStatus.CONFLICT, 'Category already exists');
    }

    const category = await Category.create(categoryData);
    return category.populate('parent');
  }

  async getCategories(filter = {}) {
    const query = {};

    if (filter.parent) {
      query.parent = filter.parent;
    } else if (filter.topLevel === 'true') {
      query.parent = null;
    }

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive === 'true';
    }

    const categories = await Category.find(query)
      .populate('parent')
      .sort({ order: 1, name: 1 });

    return categories;
  }

  async getCategoryById(categoryId) {
    const category = await Category.findById(categoryId)
      .populate('parent')
      .populate({
        path: 'subcategories',
        match: { isActive: true }
      });

    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    return category;
  }

  async getCategoryTree() {
    const categories = await Category.find({ isActive: true })
      .populate('parent')
      .sort({ order: 1, name: 1 });

    // Build tree structure
    const categoryMap = {};
    const tree = [];

    // First pass: create map
    categories.forEach((cat) => {
      categoryMap[cat._id] = { ...cat.toObject(), children: [] };
    });

    // Second pass: build tree
    categories.forEach((cat) => {
      if (cat.parent) {
        if (categoryMap[cat.parent._id]) {
          categoryMap[cat.parent._id].children.push(categoryMap[cat._id]);
        }
      } else {
        tree.push(categoryMap[cat._id]);
      }
    });

    return tree;
  }

  async updateCategory(categoryId, updateData) {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('parent');

    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    return category;
  }

  async deleteCategory(categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }

    // Check if category has children
    const childCount = await Category.countDocuments({ parent: categoryId });
    if (childCount > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Cannot delete category with subcategories'
      );
    }

    await category.deleteOne();
    return { message: 'Category deleted successfully' };
  }

  async searchCategories(query) {
    const categories = await Category.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    })
      .populate('parent')
      .limit(20);

    return categories;
  }
}

module.exports = new CategoryService();
