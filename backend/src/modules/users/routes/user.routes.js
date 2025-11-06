const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// Public routes (no authentication required)
router.get('/unsubscribe/:token', userController.unsubscribeFromEmails);

// All routes below require authentication
router.use(authenticate);

// User profile routes
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.patch('/email', userController.updateEmail);
router.patch('/preferences', userController.updatePreferences);

// Notification preferences routes
router.get('/notification-preferences', userController.getNotificationPreferences);
router.patch('/notification-preferences', userController.updateNotificationPreferences);

// Account management
router.post('/deactivate', userController.deactivateAccount);
router.delete('/account', userController.deleteAccount);

// Search users (admin only)
router.get('/search', authorize('admin'), userController.searchUsers);

module.exports = router;
