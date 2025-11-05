const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../../users/models/User.model');
const JobSeeker = require('../../jobseekers/models/JobSeeker.model');
const Employer = require('../../employers/models/Employer.model');
const tokenService = require('./token.service');
const ApiError = require('../../../shared/utils/ApiError');
const httpStatus = require('../../../shared/constants/http-status.constants');

class AuthService {
  async register(userData) {
    const { email, password, role, ...otherData } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      ...otherData,
      email,
      password: hashedPassword,
      role,
    });

    // Create role-specific profile
    if (role === 'jobseeker') {
      await JobSeeker.create({ user: user._id });
    } else if (role === 'employer' && userData.company) {
      await Employer.create({
        user: user._id,
        company: userData.company,
      });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Generate tokens
    const tokens = await tokenService.generateAuthTokens(user._id);

    return { user, tokens, verificationToken };
  }

  async login(email, password, deviceInfo = {}) {
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Account has been deactivated');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Account is locked. Please try again later'
      );
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
      }
      await user.save();
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    // Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const tokens = await tokenService.generateAuthTokens(user._id, deviceInfo);

    return { user, tokens };
  }

  async logout(refreshToken) {
    await tokenService.revokeRefreshToken(refreshToken);
  }

  async refreshTokens(refreshToken, deviceInfo = {}) {
    const tokens = await tokenService.refreshAuthTokens(refreshToken, deviceInfo);
    return tokens;
  }

  async verifyEmail(token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    return { resetToken, user };
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired reset token');
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    // Revoke all existing tokens
    await tokenService.revokeAllUserTokens(user._id);

    return user;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Verify current password
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
    }

    // Hash and save new password
    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = Date.now();
    await user.save();

    // Revoke all existing tokens except current session
    await tokenService.revokeAllUserTokens(user._id);

    return user;
  }
}

module.exports = new AuthService();