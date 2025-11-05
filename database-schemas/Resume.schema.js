const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      url: String,
      publicId: String,
      filename: String,
      fileType: {
        type: String,
        enum: ['pdf', 'doc', 'docx'],
      },
      fileSize: Number, // in bytes
    },
    parsedData: {
      personalInfo: {
        name: String,
        email: String,
        phone: String,
        location: String,
      },
      summary: String,
      skills: [String],
      experience: [
        {
          title: String,
          company: String,
          startDate: String,
          endDate: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          startDate: String,
          endDate: String,
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          date: String,
        },
      ],
      languages: [String],
      projects: [
        {
          name: String,
          description: String,
          link: String,
        },
      ],
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeTemplate',
    },
    isBuiltWithBuilder: {
      type: Boolean,
      default: false,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloadedAt: Date,
    parsedAt: Date,
    parsingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    parsingError: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ jobSeeker: 1 });
resumeSchema.index({ isPrimary: 1 });
resumeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
