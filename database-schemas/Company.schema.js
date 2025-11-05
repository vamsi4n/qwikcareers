const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    logo: {
      url: String,
      publicId: String,
    },
    coverImage: {
      url: String,
      publicId: String,
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [150, 'Tagline cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    website: {
      type: String,
      trim: true,
    },
    founded: Number,
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'],
    },
    companyType: {
      type: String,
      enum: ['public', 'private', 'non-profit', 'government', 'startup'],
    },
    industry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Industry',
    },
    specialties: [String],
    headquarters: {
      street: String,
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
    locations: [
      {
        name: String,
        type: {
          type: String,
          enum: ['headquarters', 'branch', 'remote'],
        },
        street: String,
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
          coordinates: [Number],
        },
      },
    ],
    socialMedia: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
      youtube: String,
    },
    contactInfo: {
      email: String,
      phone: String,
      fax: String,
    },
    culture: {
      values: [String],
      perks: [String],
      benefits: [String],
    },
    media: {
      photos: [
        {
          url: String,
          publicId: String,
          caption: String,
        },
      ],
      videos: [
        {
          url: String,
          thumbnail: String,
          title: String,
        },
      ],
    },
    stats: {
      totalEmployees: {
        type: Number,
        default: 0,
      },
      totalJobs: {
        type: Number,
        default: 0,
      },
      totalFollowers: {
        type: Number,
        default: 0,
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
      verificationBadge: {
        type: String,
        enum: ['none', 'bronze', 'silver', 'gold', 'platinum'],
        default: 'none',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
companySchema.index({ name: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ industry: 1 });
companySchema.index({ 'verification.isVerified': 1 });
companySchema.index({ isActive: 1 });
companySchema.index({ isFeatured: 1 });
companySchema.index({ 'stats.averageRating': -1 });
companySchema.index({ 'headquarters.coordinates': '2dsphere' });

module.exports = mongoose.model('Company', companySchema);
