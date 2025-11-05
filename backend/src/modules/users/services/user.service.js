const User = require('../../../shared/models/User.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class UserService {
  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    // Prevent updating sensitive fields
    const restrictedFields = ['password', 'email', 'role', 'isEmailVerified'];
    restrictedFields.forEach((field) => delete updateData[field]);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  async updateEmail(userId, newEmail) {
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already in use');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          email: newEmail,
          isEmailVerified: false
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  async updatePreferences(userId, preferences) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  async deactivateAccount(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  async deleteAccount(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return { message: 'Account deleted successfully' };
  }

  async searchUsers(searchParams) {
    const { q, role, page = 1, limit = 20 } = searchParams;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    if (q) {
      query.$or = [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    };
  }
}

module.exports = new UserService();
