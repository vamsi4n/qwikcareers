const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [150, 'Job title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    responsibilities: [String],
    requirements: {
      qualifications: [String],
      skills: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Skill',
        },
      ],
      experience: {
        min: Number,
        max: Number,
      },
      education: {
        degree: String,
        field: String,
      },
      certifications: [String],
      languages: [
        {
          language: String,
          proficiency: {
            type: String,
            enum: ['basic', 'conversational', 'fluent', 'native'],
          },
        },
      ],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship', 'freelance'],
      required: true,
    },
    workMode: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
      required: true,
    },
    location: {
      city: String,
      state: String,
      country: String,
      zipCode: String,
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
    salary: {
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
      isNegotiable: {
        type: Boolean,
        default: false,
      },
      showSalary: {
        type: Boolean,
        default: true,
      },
    },
    benefits: [String],
    applicationDeadline: Date,
    startDate: Date,
    numberOfPositions: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicationMethod: {
      type: {
        type: String,
        enum: ['internal', 'external', 'email'],
        default: 'internal',
      },
      externalUrl: String,
      email: String,
    },
    screeningQuestions: [
      {
        question: String,
        type: {
          type: String,
          enum: ['text', 'yes-no', 'multiple-choice'],
        },
        options: [String],
        required: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'active', 'paused', 'closed', 'filled', 'expired'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['public', 'internal', 'invite-only'],
      default: 'public',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    expiresAt: Date,
    publishedAt: Date,
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      applications: {
        type: Number,
        default: 0,
      },
      shortlisted: {
        type: Number,
        default: 0,
      },
      rejected: {
        type: Number,
        default: 0,
      },
      hired: {
        type: Number,
        default: 0,
      },
      saves: {
        type: Number,
        default: 0,
      },
      shares: {
        type: Number,
        default: 0,
      },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ slug: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ workMode: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ industry: 1 });
jobSchema.index({ 'requirements.skills': 1 });
jobSchema.index({ 'location.coordinates': '2dsphere' });
jobSchema.index({ publishedAt: -1 });
jobSchema.index({ expiresAt: 1 });
jobSchema.index({ isFeatured: 1 });
jobSchema.index({ isUrgent: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for isExpired
jobSchema.virtual('isExpired').get(function () {
  return this.expiresAt && this.expiresAt < Date.now();
});

module.exports = mongoose.model('Job', jobSchema);
