const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: String,
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance'],
      required: true,
    },
    location: {
      city: String,
      state: String,
      country: String,
    },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: Date,
    isCurrentJob: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    responsibilities: [String],
    achievements: [String],
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
experienceSchema.index({ jobSeeker: 1 });
experienceSchema.index({ startDate: -1 });
experienceSchema.index({ isCurrentJob: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
