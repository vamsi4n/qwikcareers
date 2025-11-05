const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema(
  {
    general: {
      siteName: {
        type: String,
        default: 'QwikCareers',
        trim: true,
        maxlength: [100, 'Site name cannot exceed 100 characters'],
      },
      siteDescription: {
        type: String,
        default: 'Find your dream job or hire top talent',
        trim: true,
        maxlength: [500, 'Site description cannot exceed 500 characters'],
      },
      supportEmail: {
        type: String,
        default: 'support@qwikcareers.com',
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Please provide a valid email'],
      },
      contactPhone: {
        type: String,
        default: '+1-800-555-0100',
        trim: true,
      },
      timezone: {
        type: String,
        default: 'UTC',
        trim: true,
      },
      defaultLanguage: {
        type: String,
        default: 'en',
        trim: true,
      },
    },
    email: {
      smtpHost: {
        type: String,
        default: 'smtp.gmail.com',
        trim: true,
      },
      smtpPort: {
        type: Number,
        default: 587,
        min: [1, 'Port must be at least 1'],
        max: [65535, 'Port cannot exceed 65535'],
      },
      smtpUsername: {
        type: String,
        default: '',
        trim: true,
      },
      smtpPassword: {
        type: String,
        default: '',
        select: false, // Don't return password by default
      },
      fromEmail: {
        type: String,
        default: 'noreply@qwikcareers.com',
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Please provide a valid email'],
      },
      fromName: {
        type: String,
        default: 'QwikCareers',
        trim: true,
      },
      emailNotificationsEnabled: {
        type: Boolean,
        default: true,
      },
    },
    security: {
      twoFactorAuthEnabled: {
        type: Boolean,
        default: false,
      },
      maintenanceModeEnabled: {
        type: Boolean,
        default: false,
      },
      sessionTimeoutMinutes: {
        type: Number,
        default: 60,
        min: [5, 'Session timeout must be at least 5 minutes'],
        max: [1440, 'Session timeout cannot exceed 1440 minutes (24 hours)'],
      },
      passwordMinLength: {
        type: Number,
        default: 8,
        min: [6, 'Password minimum length must be at least 6'],
        max: [128, 'Password minimum length cannot exceed 128'],
      },
      apiRateLimit: {
        type: Number,
        default: 100,
        min: [1, 'API rate limit must be at least 1'],
        max: [10000, 'API rate limit cannot exceed 10000'],
      },
      ipWhitelist: {
        type: [String],
        default: [],
      },
    },
    featureFlags: {
      userRegistrationEnabled: {
        type: Boolean,
        default: true,
      },
      jobPostingEnabled: {
        type: Boolean,
        default: true,
      },
      companyReviewsEnabled: {
        type: Boolean,
        default: true,
      },
      messagingEnabled: {
        type: Boolean,
        default: true,
      },
      pushNotificationsEnabled: {
        type: Boolean,
        default: false,
      },
      analyticsEnabled: {
        type: Boolean,
        default: true,
      },
    },
    version: {
      type: Number,
      default: 1,
      min: [1, 'Version must be at least 1'],
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Using custom updatedAt field
    collection: 'systemsettings', // Ensure singleton collection
  }
);

// Static method to get or create settings (singleton pattern)
systemSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();

  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({
      general: {
        siteName: 'QwikCareers',
        siteDescription: 'Find your dream job or hire top talent',
        supportEmail: 'support@qwikcareers.com',
        contactPhone: '+1-800-555-0100',
        timezone: 'UTC',
        defaultLanguage: 'en',
      },
      email: {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: '',
        smtpPassword: '',
        fromEmail: 'noreply@qwikcareers.com',
        fromName: 'QwikCareers',
        emailNotificationsEnabled: true,
      },
      security: {
        twoFactorAuthEnabled: false,
        maintenanceModeEnabled: false,
        sessionTimeoutMinutes: 60,
        passwordMinLength: 8,
        apiRateLimit: 100,
        ipWhitelist: [],
      },
      featureFlags: {
        userRegistrationEnabled: true,
        jobPostingEnabled: true,
        companyReviewsEnabled: true,
        messagingEnabled: true,
        pushNotificationsEnabled: false,
        analyticsEnabled: true,
      },
      version: 1,
    });
  }

  return settings;
};

// Static method to update settings
systemSettingsSchema.statics.updateSettings = async function (updates, adminId) {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.getSettings();
  }

  // Store previous values for audit log
  const previousValues = settings.toObject();

  // Update general settings
  if (updates.general) {
    settings.general = { ...settings.general, ...updates.general };
  }

  // Update email settings
  if (updates.email) {
    settings.email = { ...settings.email, ...updates.email };
  }

  // Update security settings
  if (updates.security) {
    settings.security = { ...settings.security, ...updates.security };
  }

  // Update feature flags
  if (updates.featureFlags) {
    settings.featureFlags = { ...settings.featureFlags, ...updates.featureFlags };
  }

  // Update metadata
  settings.version += 1;
  settings.lastUpdatedBy = adminId;
  settings.updatedAt = new Date();

  await settings.save();

  // Create audit log entry
  const AuditLog = mongoose.model('AuditLog');
  await AuditLog.create({
    admin: adminId,
    action: 'update',
    targetType: 'system',
    targetId: settings._id,
    details: {
      previousValues,
      newValues: settings.toObject(),
      updatedFields: Object.keys(updates),
    },
    timestamp: new Date(),
  });

  return settings;
};

// Pre-save middleware to ensure singleton
systemSettingsSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    if (count > 0) {
      throw new Error('Only one SystemSettings document can exist');
    }
  }
  next();
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
