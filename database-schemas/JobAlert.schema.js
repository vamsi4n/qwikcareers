const mongoose = require('mongoose');

const jobAlertSchema = new mongoose.Schema(
  {
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    criteria: {
      keywords: [String],
      location: {
        city: String,
        state: String,
        country: String,
        radius: Number, // in kilometers
      },
      jobTypes: [
        {
          type: String,
          enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance'],
        },
      ],
      workModes: [
        {
          type: String,
          enum: ['remote', 'hybrid', 'on-site'],
        },
      ],
      categories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Category',
        },
      ],
      industries: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Industry',
        },
      ],
      skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
      ],
      experienceLevel: {
        min: Number,
        max: Number,
      },
      salary: {
        min: Number,
        max: Number,
        currency: String,
        period: String,
      },
      companies: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company',
        },
      ],
    },
    frequency: {
      type: String,
      enum: ['instant', 'daily', 'weekly'],
      default: 'daily',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSentAt: Date,
    matchCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
jobAlertSchema.index({ jobSeeker: 1 });
jobAlertSchema.index({ isActive: 1 });
jobAlertSchema.index({ frequency: 1, lastSentAt: 1 });

module.exports = mongoose.model('JobAlert', jobAlertSchema);
