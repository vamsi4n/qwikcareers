const authService = require('../services/auth.service');
const catchAsync = require('../../../shared/utils/catchAsync');
const ApiResponse = require('../../../shared/utils/ApiResponse');
const httpStatus = require('../../../shared/constants/http-status.constants');

class AuthController {
  register = catchAsync(async (req, res) => {
    const { user, tokens, verificationToken } = await authService.register(req.body);

    // In production, send verification email here
    // await emailService.sendVerificationEmail(user.email, verificationToken);

    ApiResponse.created(res, { user, tokens }, 'Registration successful');
  });

  login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };

    const { user, tokens } = await authService.login(email, password, deviceInfo);

    ApiResponse.success(res, { user, tokens }, 'Login successful');
  });

  logout = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);

    ApiResponse.success(res, null, 'Logout successful');
  });

  refreshTokens = catchAsync(async (req, res) => {
    const { refreshToken } = req.body;
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };

    const tokens = await authService.refreshTokens(refreshToken, deviceInfo);

    ApiResponse.success(res, { tokens }, 'Tokens refreshed successfully');
  });

  verifyEmail = catchAsync(async (req, res) => {
    const { token } = req.params;
    const user = await authService.verifyEmail(token);

    ApiResponse.success(res, { user }, 'Email verified successfully');
  });

  forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const { resetToken } = await authService.forgotPassword(email);

    // In production, send password reset email here
    // await emailService.sendPasswordResetEmail(email, resetToken);

    ApiResponse.success(res, null, 'Password reset link sent to email');
  });

  resetPassword = catchAsync(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

    ApiResponse.success(res, null, 'Password reset successful');
  });

  changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    ApiResponse.success(res, null, 'Password changed successfully');
  });

  getMe = catchAsync(async (req, res) => {
    ApiResponse.success(res, { user: req.user }, 'User retrieved successfully');
  });
}

module.exports = new AuthController();