const express = require('express');
const router = express.Router();
const savedJobController = require('../controllers/saved-job.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// All routes require authentication and jobseeker role
router.use(authenticate);
router.use(authorize('jobseeker'));

router.post('/', savedJobController.saveJob);
router.get('/', savedJobController.getSavedJobs);
router.get('/check/:jobId', savedJobController.checkIfSaved);
router.patch('/:jobId/notes', savedJobController.updateNotes);
router.delete('/:jobId', savedJobController.unsaveJob);

module.exports = router;
