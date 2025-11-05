const User = require('../../users/models/User.model');
const JobSeeker = require('../../jobseekers/models/JobSeeker.model');
const Employer = require('../../employers/models/Employer.model');
const Application = require('../../applications/models/Application.model');
const Job = require('../../jobs/models/Job.model');
const SavedJob = require('../../jobs/models/SavedJob.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

/**
 * User Management Service
 * Handles admin operations related to user management
 */
class UserManagementService {
  /**
   * Search users by email or name using regex
   *
   * @param {Object} query - Search query
   * @param {string} query.search - Search term for email or name
   * @param {string} query.role - Filter by role (optional)
   * @param {number} query.page - Page number (default: 1)
   * @param {number} query.limit - Items per page (default: 20)
   * @returns {Promise<Object>} Matching users with pagination
   */
  async searchUsers(query = {}) {
    try {
      const { search = '', role, page = 1, limit = 20 } = query;

      // Build search query
      const searchQuery = { isDeleted: false };

      if (search) {
        const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
        searchQuery.$or = [
          { email: searchRegex },
          { firstName: searchRegex },
          { lastName: searchRegex },
        ];
      }

      if (role) {
        searchQuery.role = role;
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute query
      const [users, total] = await Promise.all([
        User.find(searchQuery)
          .select('-password') // Exclude password field
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(searchQuery),
      ]);

      return {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to search users: ${error.message}`
      );
    }
  }

  /**
   * Get user statistics
   *
   * @returns {Promise<Object>} User statistics by role and status
   */
  async getUserStats() {
    try {
      // Run all queries in parallel
      const [
        totalUsers,
        jobseekers,
        employers,
        admins,
        activeUsers,
        suspendedUsers,
        verifiedEmails,
        unverifiedEmails,
      ] = await Promise.all([
        User.countDocuments({ isDeleted: false }),
        User.countDocuments({ role: 'jobseeker', isDeleted: false }),
        User.countDocuments({ role: 'employer', isDeleted: false }),
        User.countDocuments({ role: 'admin', isDeleted: false }),
        User.countDocuments({ isActive: true, isDeleted: false }),
        User.countDocuments({ isActive: false, isDeleted: false }),
        User.countDocuments({ isEmailVerified: true, isDeleted: false }),
        User.countDocuments({ isEmailVerified: false, isDeleted: false }),
      ]);

      return {
        total: totalUsers,
        byRole: {
          jobseeker: jobseekers,
          employer: employers,
          admin: admins,
        },
        byStatus: {
          active: activeUsers,
          suspended: suspendedUsers,
        },
        byVerification: {
          verified: verifiedEmails,
          unverified: unverifiedEmails,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to retrieve user statistics: ${error.message}`
      );
    }
  }

  /**
   * Bulk update multiple users
   *
   * @param {Array<string>} userIds - Array of user IDs to update
   * @param {Object} updates - Update fields (e.g., { isActive: false, role: 'jobseeker' })
   * @returns {Promise<Object>} Result with count of updated users
   * @throws {ApiError} If validation fails or update fails
   */
  async bulkUpdateUsers(userIds, updates) {
    try {
      // Validate input
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'User IDs array is required');
      }

      if (!updates || Object.keys(updates).isEmpty) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Updates object is required');
      }

      // Prevent updating sensitive fields via bulk update
      const prohibitedFields = ['password', 'email', 'socialAuth'];
      const updateKeys = Object.keys(updates);
      const hasProhibitedField = updateKeys.some((key) =>
        prohibitedFields.includes(key)
      );

      if (hasProhibitedField) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Cannot bulk update sensitive fields (password, email, socialAuth)'
        );
      }

      // Perform bulk update
      const result = await User.updateMany(
        { _id: { $in: userIds }, isDeleted: false },
        { $set: updates }
      );

      return {
        success: true,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        message: `Successfully updated ${result.modifiedCount} out of ${userIds.length} users`,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to bulk update users: ${error.message}`
      );
    }
  }

  /**
   * Export user data for GDPR compliance and data portability
   * Gathers all user-related data from all modules
   *
   * @param {string} userId - User ID to export data for
   * @returns {Promise<Object>} Complete user data export
   * @throws {ApiError} If user not found
   */
  async exportUserData(userId) {
    try {
      // Fetch user
      const user = await User.findById(userId).select('-password').lean();

      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
      }

      // Prepare data export object
      const userDataExport = {
        exportedAt: new Date(),
        user: {
          basic: user,
        },
      };

      // Fetch role-specific profile
      if (user.role === 'jobseeker') {
        const jobseekerProfile = await JobSeeker.findOne({ user: userId }).lean();
        userDataExport.user.profile = jobseekerProfile;

        // Fetch job seeker related data
        const [applications, savedJobs] = await Promise.all([
          Application.find({ applicant: userId }).populate('job').lean(),
          SavedJob.find({ user: userId }).populate('job').lean(),
        ]);

        userDataExport.applications = applications;
        userDataExport.savedJobs = savedJobs;
      } else if (user.role === 'employer') {
        const employerProfile = await Employer.findOne({ user: userId })
          .populate('company')
          .lean();
        userDataExport.user.profile = employerProfile;

        // Fetch employer related data
        const jobs = await Job.find({ postedBy: employerProfile?._id })
          .populate('company')
          .lean();
        userDataExport.jobs = jobs;
      }

      // Add metadata
      userDataExport.metadata = {
        version: '1.0',
        format: 'JSON',
        purpose: 'GDPR Data Export / Data Portability',
        totalRecords: Object.keys(userDataExport).length,
      };

      return userDataExport;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Failed to export user data: ${error.message}`
      );
    }
  }
}

module.exports = new UserManagementService();
