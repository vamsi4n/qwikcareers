const catchAsync = require('../../../shared/utils/catchAsync');
const SystemSettings = require('../models/SystemSettings.model');
const AuditLog = require('../models/AuditLog.model');

/**
 * Get current system settings
 * @route GET /api/admin/settings
 * @access Private (Admin only)
 */
exports.getSettings = catchAsync(async (req, res) => {
  // Use the static method to get or create settings
  const settings = await SystemSettings.getSettings();

  // Convert to object and remove sensitive fields
  const settingsObj = settings.toObject();

  // Remove password from email settings for security
  if (settingsObj.email && settingsObj.email.smtpPassword) {
    settingsObj.email.smtpPassword = undefined;
  }

  res.status(200).json({
    success: true,
    data: settingsObj,
    message: 'System settings retrieved successfully',
  });
});

/**
 * Update system settings
 * @route PUT /api/admin/settings
 * @access Private (Admin only)
 */
exports.updateSettings = catchAsync(async (req, res) => {
  const updates = req.body;
  const adminId = req.user._id;

  // Validate that at least one section is being updated
  const validSections = ['general', 'email', 'security', 'featureFlags'];
  const hasValidSection = Object.keys(updates).some((key) =>
    validSections.includes(key)
  );

  if (!hasValidSection) {
    return res.status(400).json({
      success: false,
      message: 'At least one valid settings section (general, email, security, featureFlags) must be provided',
    });
  }

  // Use the static method to update settings (it handles audit log creation)
  const updatedSettings = await SystemSettings.updateSettings(updates, adminId);

  // Remove password from response
  const settingsObj = updatedSettings.toObject();
  if (settingsObj.email && settingsObj.email.smtpPassword) {
    settingsObj.email.smtpPassword = undefined;
  }

  res.status(200).json({
    success: true,
    data: settingsObj,
    message: 'System settings updated successfully',
  });
});

/**
 * Get settings by specific section
 * @route GET /api/admin/settings/:section
 * @access Private (Admin only)
 */
exports.getSettingsBySection = catchAsync(async (req, res) => {
  const { section } = req.params;

  // Validate section
  const validSections = ['general', 'email', 'security', 'featureFlags'];
  if (!validSections.includes(section)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid section. Must be one of: general, email, security, featureFlags',
    });
  }

  // Get settings
  const settings = await SystemSettings.getSettings();

  // Extract the specific section
  const sectionData = settings[section];

  // Remove password from email settings for security
  if (section === 'email' && sectionData.smtpPassword) {
    const sectionObj = { ...sectionData };
    sectionObj.smtpPassword = undefined;

    return res.status(200).json({
      success: true,
      data: sectionObj,
      message: `${section} settings retrieved successfully`,
    });
  }

  res.status(200).json({
    success: true,
    data: sectionData,
    message: `${section} settings retrieved successfully`,
  });
});

/**
 * Reset settings to defaults
 * @route POST /api/admin/settings/reset
 * @access Private (Admin only)
 */
exports.resetSettings = catchAsync(async (req, res) => {
  const adminId = req.user._id;

  // Get current settings
  let settings = await SystemSettings.findOne();

  if (!settings) {
    // If no settings exist, create default ones
    settings = await SystemSettings.getSettings();
  }

  // Store old values for audit log
  const oldValues = settings.toObject();

  // Reset to default values
  settings.general = {
    siteName: 'QwikCareers',
    siteDescription: 'Find your dream job or hire top talent',
    supportEmail: 'support@qwikcareers.com',
    contactPhone: '+1-800-555-0100',
    timezone: 'UTC',
    defaultLanguage: 'en',
  };

  settings.email = {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@qwikcareers.com',
    fromName: 'QwikCareers',
    emailNotificationsEnabled: true,
  };

  settings.security = {
    twoFactorAuthEnabled: false,
    maintenanceModeEnabled: false,
    sessionTimeoutMinutes: 60,
    passwordMinLength: 8,
    apiRateLimit: 100,
    ipWhitelist: [],
  };

  settings.featureFlags = {
    userRegistrationEnabled: true,
    jobPostingEnabled: true,
    companyReviewsEnabled: true,
    messagingEnabled: true,
    pushNotificationsEnabled: false,
    analyticsEnabled: true,
  };

  settings.version += 1;
  settings.lastUpdatedBy = adminId;
  settings.updatedAt = new Date();

  await settings.save();

  // Extract request info
  const ipAddress = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Create audit log
  await AuditLog.create({
    admin: adminId,
    action: 'update',
    targetType: 'system',
    targetId: settings._id,
    details: {
      action: 'reset_to_defaults',
      previousValues: oldValues,
      newValues: settings.toObject(),
    },
    ipAddress,
    userAgent,
    timestamp: new Date(),
  });

  // Remove password from response
  const settingsObj = settings.toObject();
  if (settingsObj.email && settingsObj.email.smtpPassword) {
    settingsObj.email.smtpPassword = undefined;
  }

  res.status(200).json({
    success: true,
    data: settingsObj,
    message: 'System settings reset to defaults successfully',
  });
});
