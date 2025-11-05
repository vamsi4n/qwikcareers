const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');
const authorize = require('../../auth/middleware/authorize.middleware');

// Public routes
router.get('/', skillController.getSkills);
router.get('/search', skillController.searchSkills);
router.get('/popular', skillController.getPopularSkills);
router.get('/:id', skillController.getSkillById);

// Admin routes
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', skillController.createSkill);
router.patch('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);

module.exports = router;