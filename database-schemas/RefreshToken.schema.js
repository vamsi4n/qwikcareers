const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    deviceInfo: {
      userAgent: String,
      ip: String,
      device: String,
      browser: String,
      os: String,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ user: 1 });
refreshTokenSchema.index({ expiresAt: 1 });
refreshTokenSchema.index({ isRevoked: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
