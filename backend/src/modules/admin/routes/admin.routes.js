/**
 * Admin Routes Configuration
 * Defines all admin-related API endpoints with proper authentication and authorization
 *
 * All routes require:
 * - Authentication (authenticate middleware)
 * - Admin role (requireAdmin middleware)
 * - Specific permissions (checkPermission middleware)
 */

const express = require('express');
const router = express.Router();

// Import authentication middleware
const authenticate = require('../../auth/middleware/authenticate.middleware');

// Import admin authorization middleware
const requireAdmin = require('../middleware/admin-auth.middleware');
const checkPermission = require('../middleware/admin-permission.middleware');

// Import controllers
const userManagementController = require('../controllers/user-management.controller');
const contentModerationController = require('../controllers/content-moderation.controller');
const adminController = require('../controllers/admin.controller');
const systemSettingsController = require('../controllers/system-settings.controller');

// ============================================================================
// Apply authentication and admin requirement to all routes
// ============================================================================
router.use(authenticate);
router.use(requireAdmin);

// ============================================================================
// User Management Routes
// Endpoints for managing platform users
// ============================================================================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Private (Admin only - requires 'manage_users' permission)
 */
router.get(
  '/users',
  checkPermission('manage_users'),
  userManagementController.getAllUsers
);

/**
 * @route   GET /api/admin/users/:userId
 * @desc    Get a specific user by ID
 * @access  Private (Admin only - requires 'manage_users' permission)
 */
router.get(
  '/users/:userId',
  checkPermission('manage_users'),
  userManagementController.getUserById
);

/**
 * @route   PATCH /api/admin/users/:userId/status
 * @desc    Update user status (activate, suspend, etc.)
 * @access  Private (Admin only - requires 'manage_users' permission)
 */
router.patch(
  '/users/:userId/status',
  checkPermission('manage_users'),
  userManagementController.updateUserStatus
);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete a user (soft delete)
 * @access  Private (Admin only - requires 'manage_users' permission)
 */
router.delete(
  '/users/:userId',
  checkPermission('manage_users'),
  userManagementController.deleteUser
);

/**
 * @route   PATCH /api/admin/users/:userId/permissions
 * @desc    Update user custom permissions (override role defaults)
 * @access  Private (Admin only - requires 'manage_permissions' permission)
 */
router.patch(
  '/users/:userId/permissions',
  checkPermission('manage_permissions'),
  userManagementController.updateUserPermissions
);

// ============================================================================
// Content Moderation Routes
// Endpoints for moderating user-generated content
// ============================================================================

/**
 * @route   GET /api/admin/moderation
 * @desc    Get moderation queue with pending items
 * @access  Private (Admin only - requires 'moderate_content' permission)
 */
router.get(
  '/moderation',
  checkPermission('moderate_content'),
  contentModerationController.getModerationQueue
);

/**
 * @route   POST /api/admin/moderation
 * @desc    Create a new moderation report
 * @access  Private (Admin only - requires 'moderate_content' permission)
 */
router.post(
  '/moderation',
  checkPermission('moderate_content'),
  contentModerationController.createModerationReport
);

/**
 * @route   GET /api/admin/moderation/:reportId
 * @desc    Get a specific moderation item by ID
 * @access  Private (Admin only - requires 'moderate_content' permission)
 */
router.get(
  '/moderation/:reportId',
  checkPermission('moderate_content'),
  contentModerationController.getModerationItemById
);

/**
 * @route   POST /api/admin/moderation/:reportId/approve
 * @desc    Approve content and resolve moderation report
 * @access  Private (Admin only - requires 'moderate_content' permission)
 */
router.post(
  '/moderation/:reportId/approve',
  checkPermission('moderate_content'),
  contentModerationController.approveContent
);

/**
 * @route   POST /api/admin/moderation/:reportId/reject
 * @desc    Reject a moderation report without taking action
 * @access  Private (Admin only - requires 'moderate_content' permission)
 */
router.post(
  '/moderation/:reportId/reject',
  checkPermission('moderate_content'),
  contentModerationController.rejectReport
);

/**
 * @route   POST /api/admin/moderation/:reportId/remove
 * @desc    Remove content and resolve moderation report
 * @access  Private (Admin only - requires 'moderate_content' permission)
 */
router.post(
  '/moderation/:reportId/remove',
  checkPermission('moderate_content'),
  contentModerationController.removeContent
);

// ============================================================================
// Analytics Routes
// Endpoints for viewing platform analytics and statistics
// ============================================================================

/**
 * @route   GET /api/admin/analytics/platform
 * @desc    Get platform-wide analytics and statistics
 * @access  Private (Admin only - requires 'view_analytics' permission)
 */
router.get(
  '/analytics/platform',
  checkPermission('view_analytics'),
  adminController.getPlatformAnalytics
);

/**
 * @route   GET /api/admin/analytics/users
 * @desc    Get user-related analytics
 * @access  Private (Admin only - requires 'view_analytics' permission)
 */
router.get(
  '/analytics/users',
  checkPermission('view_analytics'),
  adminController.getUserAnalytics
);

/**
 * @route   GET /api/admin/analytics/jobs
 * @desc    Get job-related analytics
 * @access  Private (Admin only - requires 'view_analytics' permission)
 */
router.get(
  '/analytics/jobs',
  checkPermission('view_analytics'),
  adminController.getJobAnalytics
);

/**
 * @route   GET /api/admin/analytics/activity
 * @desc    Get recent platform activity
 * @access  Private (Admin only - requires 'view_analytics' permission)
 */
router.get(
  '/analytics/activity',
  checkPermission('view_analytics'),
  adminController.getRecentActivity
);

// ============================================================================
// System Settings Routes
// Endpoints for managing system-wide settings and configuration
// ============================================================================

/**
 * @route   GET /api/admin/settings
 * @route   PUT /api/admin/settings
 * @desc    Get or update all system settings
 * @access  Private (Admin only)
 *          GET - requires 'view_analytics' permission
 *          PUT - requires 'manage_settings' permission
 */
router
  .route('/settings')
  .get(
    checkPermission('view_analytics'),
    systemSettingsController.getSettings
  )
  .put(
    checkPermission('manage_settings'),
    systemSettingsController.updateSettings
  );

/**
 * @route   GET /api/admin/settings/:section
 * @desc    Get settings for a specific section
 * @access  Private (Admin only - requires 'view_analytics' permission)
 */
router.get(
  '/settings/:section',
  checkPermission('view_analytics'),
  systemSettingsController.getSettingsBySection
);

/**
 * @route   POST /api/admin/settings/reset
 * @desc    Reset system settings to default values
 * @access  Private (Admin only - requires 'manage_settings' permission)
 */
router.post(
  '/settings/reset',
  checkPermission('manage_settings'),
  systemSettingsController.resetSettings
);

// ============================================================================
// Audit Log Routes
// Endpoints for viewing admin action audit logs
// ============================================================================

/**
 * @route   GET /api/admin/audit-logs
 * @desc    Get audit logs with filtering and pagination
 * @access  Private (Admin only - requires 'view_analytics' permission)
 */
router.get(
  '/audit-logs',
  checkPermission('view_analytics'),
  adminController.getAuditLogs
);

// ============================================================================
// Export router
// ============================================================================
module.exports = router;
