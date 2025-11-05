const express = require('express');
const jobController = require('../controllers/job.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

const router = express.Router();

router.get('/search', jobController.searchJobs);
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);

router.use(authenticate);
router.post('/', authorize('employer', 'admin'), jobController.createJob);
router.patch('/:id', authorize('employer', 'admin'), jobController.updateJob);
router.delete('/:id', authorize('employer', 'admin'), jobController.deleteJob);

module.exports = router;