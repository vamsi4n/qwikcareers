const express = require('express');
const applicationController = require('../controllers/application.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

const router = express.Router();

router.use(authenticate);

router.post('/', authorize('jobseeker'), applicationController.applyToJob);
router.get('/my-applications', authorize('jobseeker'), applicationController.getMyApplications);
router.get('/:id', applicationController.getApplication);
router.get('/job/:jobId', authorize('employer', 'admin'), applicationController.getJobApplications);
router.patch('/:id/status', authorize('employer', 'admin'), applicationController.updateApplicationStatus);
router.post('/:id/withdraw', authorize('jobseeker'), applicationController.withdrawApplication);

module.exports = router;