const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true,
    },
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    institutionLogo: String,
    location: {
      city: String,
      state: String,
      country: String,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: Date,
    isCurrentlyStudying: {
      type: Boolean,
      default: false,
    },
    grade: String,
    gpa: {
      value: Number,
      scale: Number,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    achievements: [String],
    activities: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes
educationSchema.index({ jobSeeker: 1 });
educationSchema.index({ startDate: -1 });

module.exports = mongoose.model('Education', educationSchema);
