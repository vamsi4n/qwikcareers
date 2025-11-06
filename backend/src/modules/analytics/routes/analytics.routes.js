const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authenticate = require('../../auth/middleware/authenticate.middleware');

// All analytics routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/analytics/jobs/:jobId/views
 * @desc    Get job views time-series data
 * @access  Private (Job owner or admin)
 */
router.get('/jobs/:jobId/views', analyticsController.getJobViewsTimeSeries);

/**
 * @route   GET /api/v1/analytics/profiles/:profileId/views
 * @desc    Get profile views time-series data
 * @access  Private (Profile owner or admin)
 */
router.get('/profiles/:profileId/views', analyticsController.getProfileViewsTimeSeries);

/**
 * @route   GET /api/v1/analytics/events
 * @desc    Get analytics events time-series
 * @access  Private
 */
router.get('/events', analyticsController.getEventsTimeSeries);

/**
 * @route   GET /api/v1/analytics/events/aggregate
 * @desc    Get aggregate statistics for multiple event types
 * @access  Private
 */
router.get('/events/aggregate', analyticsController.getAggregateEvents);

module.exports = router;
