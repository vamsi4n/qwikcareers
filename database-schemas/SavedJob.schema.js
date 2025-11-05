const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
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
    note: {
      type: String,
      trim: true,
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
    folder: {
      type: String,
      default: 'default',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique job-jobseeker combination
savedJobSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });
savedJobSchema.index({ jobSeeker: 1, createdAt: -1 });

module.exports = mongoose.model('SavedJob', savedJobSchema);
