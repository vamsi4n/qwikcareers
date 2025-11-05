const mongoose = require('mongoose');

const jobSeekerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [100, 'Headline cannot exceed 100 characters'],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [2000, 'Summary cannot exceed 2000 characters'],
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    },
    currentLocation: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: '2dsphere',
        },
      },
    },
    nationality: String,
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ['basic', 'conversational', 'fluent', 'native'],
        },
      },
    ],
    workExperience: {
      totalYears: {
        type: Number,
        default: 0,
      },
      currentEmploymentStatus: {
        type: String,
        enum: ['employed', 'unemployed', 'student', 'freelancer'],
      },
      currentCompany: String,
      currentDesignation: String,
    },
    education: {
      highestDegree: String,
      fieldOfStudy: String,
      institution: String,
      graduationYear: Number,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    portfolio: {
      website: String,
      github: String,
      linkedin: String,
      behance: String,
      dribbble: String,
      other: [String],
    },
    preferences: {
      jobTypes: {
        type: [String],
        enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance'],
      },
      workModes: {
        type: [String],
        enum: ['remote', 'hybrid', 'on-site'],
      },
      expectedSalary: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: 'USD',
        },
        period: {
          type: String,
          enum: ['hourly', 'monthly', 'yearly'],
          default: 'yearly',
        },
      },
      preferredLocations: [
        {
          city: String,
          state: String,
          country: String,
        },
      ],
      preferredIndustries: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Industry',
        },
      ],
      preferredRoles: [String],
      willingToRelocate: {
        type: Boolean,
        default: false,
      },
      noticePeriod: {
        type: Number, // in days
        default: 30,
      },
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    profileStrength: {
      type: String,
      enum: ['weak', 'average', 'good', 'excellent'],
      default: 'weak',
    },
    visibility: {
      type: String,
      enum: ['public', 'private', 'connections-only'],
      default: 'public',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availableFrom: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
jobSeekerSchema.index({ user: 1 });
jobSeekerSchema.index({ skills: 1 });
jobSeekerSchema.index({ 'preferences.jobTypes': 1 });
jobSeekerSchema.index({ 'preferences.preferredLocations': 1 });
jobSeekerSchema.index({ profileCompleteness: -1 });
jobSeekerSchema.index({ isAvailable: 1 });
jobSeekerSchema.index({ 'currentLocation.coordinates': '2dsphere' });

module.exports = mongoose.model('JobSeeker', jobSeekerSchema);
