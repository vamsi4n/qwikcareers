const catchAsync = require('../../../shared/utils/catchAsync');
const User = require('../../users/models/User.model');
const AuditLog = require('../models/AuditLog.model');
const socketService = require('../../../services/socket.service');

/**
 * Get all users with pagination, filtering, and search
 * @route GET /api/admin/users
 * @access Private (Admin only)
 */
exports.getAllUsers = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    role,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = { isDeleted: false };

  // Filter by role if provided
  if (role) {
    query.role = role;
  }

  // Search by name or email
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  // Execute query
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken -twoFactorSecret')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: totalPages,
        limit: parseInt(limit),
      },
    },
    message: 'Users retrieved successfully',
  });
});

/**
 * Get single user by ID with full details
 * @route GET /api/admin/users/:userId
 * @access Private (Admin only)
 */
exports.getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId)
    .select('-password -emailVerificationToken -passwordResetToken -twoFactorSecret')
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
    message: 'User retrieved successfully',
  });
});

/**
 * Update user status (activate/suspend)
 * @route PATCH /api/admin/users/:userId/status
 * @access Private (Admin only)
 */
exports.updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  // Validate status
  if (!status || !['active', 'suspended'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be "active" or "suspended"',
    });
  }

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Store old status for audit log
  const oldStatus = user.isActive;

  // Update user status
  user.isActive = status === 'active';
  await user.save();

  // Extract admin info from request
  const adminId = req.user._id;
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create audit log entry
  await AuditLog.create({
    admin: adminId,
    action: status === 'active' ? 'activate' : 'suspend',
    targetType: 'user',
    targetId: userId,
    details: {
      oldStatus: oldStatus ? 'active' : 'suspended',
      newStatus: status,
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  // Emit real-time event to admins and affected user
  const userForSocket = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive,
    role: user.role,
    status: status,
  };
  socketService.emitUserStatusChanged(userForSocket);

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
    },
    message: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
  });
});

/**
 * Delete user permanently
 * @route DELETE /api/admin/users/:userId
 * @access Private (Admin only)
 */
exports.deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account',
    });
  }

  // Soft delete (mark as deleted)
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();

  // Extract admin info from request
  const adminId = req.user._id;
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create audit log entry
  await AuditLog.create({
    admin: adminId,
    action: 'delete',
    targetType: 'user',
    targetId: userId,
    details: {
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      deletedAt: user.deletedAt,
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

/**
 * Update user custom permissions
 * @route PATCH /api/admin/users/:userId/permissions
 * @access Private (Admin only - requires 'manage_permissions' permission)
 */
exports.updateUserPermissions = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { customPermissions } = req.body;

  // Validate customPermissions - should be an array of strings or null/undefined to reset
  if (customPermissions !== null && customPermissions !== undefined) {
    if (!Array.isArray(customPermissions)) {
      return res.status(400).json({
        success: false,
        message: 'customPermissions must be an array of permission strings or null to reset',
      });
    }

    // Validate each permission is a string
    if (!customPermissions.every(p => typeof p === 'string')) {
      return res.status(400).json({
        success: false,
        message: 'All permissions must be strings',
      });
    }
  }

  // Find user
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Store old permissions for audit log
  const oldPermissions = user.customPermissions;

  // Update custom permissions
  // Set to undefined if null or empty array to use role-based permissions
  user.customPermissions = (customPermissions === null || (Array.isArray(customPermissions) && customPermissions.length === 0))
    ? undefined
    : customPermissions;

  await user.save();

  // Extract admin info from request
  const adminId = req.user._id;
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create audit log entry
  await AuditLog.create({
    admin: adminId,
    action: 'update_permissions',
    targetType: 'user',
    targetId: userId,
    details: {
      userId: user._id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      oldPermissions: oldPermissions || 'role-based',
      newPermissions: user.customPermissions || 'role-based',
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      customPermissions: user.customPermissions,
    },
    message: 'User permissions updated successfully',
  });
});
