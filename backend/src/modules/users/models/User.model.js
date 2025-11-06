const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10,15}$/, 'Please provide a valid phone number'],
    },
    avatar: {
      url: String,
      publicId: String,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer', 'admin'],
      default: 'jobseeker',
    },
    customPermissions: {
      type: [String],
      default: undefined,
      description: 'Custom permissions that override role-based permissions. If set, these are used instead of role permissions.',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    socialAuth: {
      google: {
        id: String,
        email: String,
      },
      linkedin: {
        id: String,
        email: String,
      },
      facebook: {
        id: String,
        email: String,
      },
    },
    preferences: {
      language: {
        type: String,
        default: 'en',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
    },
    notificationPreferences: {
      emailFrequency: {
        type: String,
        enum: ['instant', 'daily', 'weekly', 'never'],
        default: 'instant',
      },
      types: {
        // Job Seeker notifications
        applicationStatus: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        newJobMatch: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        newMessage: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        interviewScheduled: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        jobAlert: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: false },
        },
        profileView: {
          email: { type: Boolean, default: false },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: false },
        },
        offerExtended: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        // Employer notifications
        applicationReceived: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        subscriptionExpiring: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: false },
        },
        paymentSuccess: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: false },
        },
        paymentFailed: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
        // System notifications
        system: {
          email: { type: Boolean, default: true },
          inApp: { type: Boolean, default: true },
          push: { type: Boolean, default: true },
        },
      },
    },
    unsubscribeToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account locked status
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save hook to generate unsubscribe token
userSchema.pre('save', function (next) {
  if (this.isNew && !this.unsubscribeToken) {
    const crypto = require('crypto');
    this.unsubscribeToken = crypto.randomBytes(32).toString('hex');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
