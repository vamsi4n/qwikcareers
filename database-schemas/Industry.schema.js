const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Industry name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    companyCount: {
      type: Number,
      default: 0,
    },
    jobCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
industrySchema.index({ name: 1 });
industrySchema.index({ slug: 1 });

module.exports = mongoose.model('Industry', industrySchema);
