const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        'programming',
        'framework',
        'database',
        'cloud',
        'design',
        'marketing',
        'management',
        'communication',
        'analytical',
        'other',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    relatedSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    popularity: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
skillSchema.index({ name: 1 });
skillSchema.index({ slug: 1 });
skillSchema.index({ category: 1 });
skillSchema.index({ popularity: -1 });

module.exports = mongoose.model('Skill', skillSchema);
