const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate.middleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/change-password', authenticate, authController.changePassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;