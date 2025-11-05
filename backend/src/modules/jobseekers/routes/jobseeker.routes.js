const express = require('express');
const router = express.Router();
const jobSeekerController = require('../controllers/jobseeker.controller');
const experienceController = require('../controllers/experience.controller');
const educationController = require('../controllers/education.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// All routes require authentication
router.use(authenticate);

// JobSeeker profile routes (jobseeker only)
router.get('/profile', authorize('jobseeker'), jobSeekerController.getProfile);
router.put('/profile', authorize('jobseeker'), jobSeekerController.createOrUpdateProfile);
router.patch('/work-experience', authorize('jobseeker'), jobSeekerController.updateWorkExperience);

// Skills management
router.post('/skills', authorize('jobseeker'), jobSeekerController.addSkills);
router.delete('/skills/:skillId', authorize('jobseeker'), jobSeekerController.removeSkill);

// Experience routes
router.post('/experience', authorize('jobseeker'), experienceController.createExperience);
router.get('/experience', authorize('jobseeker'), experienceController.getExperiences);
router.get('/experience/:id', authorize('jobseeker'), experienceController.getExperienceById);
router.patch('/experience/:id', authorize('jobseeker'), experienceController.updateExperience);
router.delete('/experience/:id', authorize('jobseeker'), experienceController.deleteExperience);

// Education routes
router.post('/education', authorize('jobseeker'), educationController.createEducation);
router.get('/education', authorize('jobseeker'), educationController.getEducations);
router.get('/education/:id', authorize('jobseeker'), educationController.getEducationById);
router.patch('/education/:id', authorize('jobseeker'), educationController.updateEducation);
router.delete('/education/:id', authorize('jobseeker'), educationController.deleteEducation);

// Search jobseekers (employer and admin)
router.get('/search', authorize('employer', 'admin'), jobSeekerController.searchJobSeekers);

module.exports = router;
