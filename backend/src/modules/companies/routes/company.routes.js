const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// Public routes
router.get('/search', companyController.searchCompanies);
router.get('/featured', companyController.getFeaturedCompanies);
router.get('/slug/:slug', companyController.getCompanyBySlug);
router.get('/:id', companyController.getCompanyById);

// Protected routes
router.use(authenticate);

// Create company (employer and admin)
router.post('/', authorize('employer', 'admin'), companyController.createCompany);

// Update company (employer and admin)
router.patch('/:id', authorize('employer', 'admin'), companyController.updateCompany);
router.post('/:id/locations', authorize('employer', 'admin'), companyController.addLocation);
router.patch('/:id/stats', authorize('employer', 'admin'), companyController.updateStats);

// Admin only routes
router.delete('/:id', authorize('admin'), companyController.deleteCompany);
router.post('/:id/verify', authorize('admin'), companyController.verifyCompany);

module.exports = router;
