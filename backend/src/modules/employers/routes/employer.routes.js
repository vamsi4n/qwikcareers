const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employer.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// All routes require authentication
router.use(authenticate);

// Employer profile routes (employer only)
router.get('/profile', authorize('employer'), employerController.getProfile);
router.put('/profile', authorize('employer'), employerController.createOrUpdateProfile);
router.patch('/company', authorize('employer'), employerController.updateCompany);
router.patch('/permissions', authorize('employer'), employerController.updatePermissions);

// Verify employer (admin only)
router.post('/verify/:employerId', authorize('admin'), employerController.verifyEmployer);

// Search employers (admin only)
router.get('/search', authorize('admin'), employerController.searchEmployers);

module.exports = router;
