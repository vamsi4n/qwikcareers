const express = require('express');
const router = express.Router();
const jobAlertController = require('../controllers/job-alert.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// All routes require authentication and jobseeker role
router.use(authenticate);
router.use(authorize('jobseeker'));

router.post('/', jobAlertController.createAlert);
router.get('/', jobAlertController.getAlerts);
router.get('/:id', jobAlertController.getAlertById);
router.patch('/:id', jobAlertController.updateAlert);
router.delete('/:id', jobAlertController.deleteAlert);
router.post('/:id/toggle', jobAlertController.toggleAlert);
router.get('/:id/matches', jobAlertController.findMatchingJobs);

module.exports = router;
