const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'JobSeeker',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [5000, 'Cover letter cannot exceed 5000 characters'],
    },
    answers: [
      {
        question: String,
        answer: mongoose.Schema.Types.Mixed,
      },
    ],
    status: {
      type: String,
      enum: [
        'submitted',
        'under-review',
        'shortlisted',
        'interview-scheduled',
        'interviewed',
        'offered',
        'hired',
        'rejected',
        'withdrawn',
      ],
      default: 'submitted',
    },
    stage: {
      type: String,
      enum: [
        'application-received',
        'screening',
        'phone-interview',
        'technical-assessment',
        'first-interview',
        'second-interview',
        'final-interview',
        'offer-extended',
        'offer-accepted',
        'offer-declined',
        'closed',
      ],
      default: 'application-received',
    },
    timeline: [
      {
        status: String,
        stage: String,
        note: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      overall: {
        type: Number,
        min: 0,
        max: 5,
      },
      skills: {
        type: Number,
        min: 0,
        max: 5,
      },
      experience: {
        type: Number,
        min: 0,
        max: 5,
      },
      cultural: Fit: {
        type: Number,
        min: 0,
        max: 5,
      },
      communication: {
        type: Number,
        min: 0,
        max: 5,
      },
    },
    notes: [
      {
        content: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        isPrivate: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    interviews: [
      {
        type: {
          type: String,
          enum: ['phone', 'video', 'in-person', 'technical'],
        },
        scheduledAt: Date,
        duration: Number, // in minutes
        location: String,
        meetingLink: String,
        interviewers: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        status: {
          type: String,
          enum: ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no-show'],
        },
        feedback: String,
        rating: {
          type: Number,
          min: 0,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    assessments: [
      {
        type: String,
        title: String,
        link: String,
        dueDate: Date,
        submittedAt: Date,
        score: Number,
        passed: Boolean,
        feedback: String,
      },
    ],
    offer: {
      salary: {
        amount: Number,
        currency: String,
        period: String,
      },
      benefits: [String],
      startDate: Date,
      offeredAt: Date,
      expiresAt: Date,
      acceptedAt: Date,
      declinedAt: Date,
      declineReason: String,
    },
    source: {
      type: String,
      enum: ['direct', 'job-board', 'referral', 'social-media', 'company-website', 'recruiter'],
      default: 'direct',
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    withdrawnAt: Date,
    withdrawReason: String,
    viewedByEmployer: {
      type: Boolean,
      default: false,
    },
    viewedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes
applicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ jobSeeker: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ stage: 1 });
applicationSchema.index({ isStarred: 1 });
applicationSchema.index({ isArchived: 1 });
applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
