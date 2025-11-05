const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken.model');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class TokenService {
  generateAccessToken(userId) {
    const payload = { sub: userId };
    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
  }

  async generateRefreshToken(userId, deviceInfo = {}) {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await RefreshToken.create({
      token,
      user: userId,
      expiresAt,
      deviceInfo,
    });

    return token;
  }

  async generateAuthTokens(userId, deviceInfo = {}) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = await this.generateRefreshToken(userId, deviceInfo);

    return {
      access: {
        token: accessToken,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
      refresh: {
        token: refreshToken,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    };
  }

  verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return payload;
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }
  }

  async verifyRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token });

    if (!refreshToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token not found');
    }

    if (!refreshToken.isValid()) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token expired or revoked');
    }

    return refreshToken;
  }

  async refreshAuthTokens(refreshTokenString, deviceInfo = {}) {
    const refreshToken = await this.verifyRefreshToken(refreshTokenString);

    // Revoke old refresh token
    refreshToken.isRevoked = true;
    refreshToken.revokedAt = new Date();
    await refreshToken.save();

    // Generate new tokens
    const tokens = await this.generateAuthTokens(refreshToken.user, deviceInfo);

    return tokens;
  }

  async revokeRefreshToken(token) {
    const refreshToken = await RefreshToken.findOne({ token });

    if (refreshToken) {
      refreshToken.isRevoked = true;
      refreshToken.revokedAt = new Date();
      await refreshToken.save();
    }
  }

  async revokeAllUserTokens(userId) {
    await RefreshToken.updateMany(
      { user: userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );
  }

  async cleanupExpiredTokens() {
    await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
  }
}

module.exports = new TokenService();