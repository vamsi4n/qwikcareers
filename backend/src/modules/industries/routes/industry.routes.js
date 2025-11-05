const express = require('express');
const router = express.Router();
const industryController = require('../controllers/industry.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// Public routes
router.get('/', industryController.getIndustries);
router.get('/search', industryController.searchIndustries);
router.get('/popular', industryController.getPopularIndustries);
router.get('/:id', industryController.getIndustryById);

// Admin routes
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', industryController.createIndustry);
router.patch('/:id', industryController.updateIndustry);
router.delete('/:id', industryController.deleteIndustry);

module.exports = router;