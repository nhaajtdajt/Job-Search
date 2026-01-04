const express = require('express');
const router = express.Router();
const SavedJobController = require('../controllers/saved_job.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Saved Job Routes
 * Base path: /api/saved-jobs
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authMiddleware.authenticate);

/**
 * @route   GET /api/saved-jobs
 * @desc    Get all saved jobs for authenticated user
 * @access  Private
 */
router.get('/', SavedJobController.getSavedJobs);

/**
 * @route   GET /api/saved-jobs/count
 * @desc    Get count of saved jobs
 * @access  Private
 */
router.get('/count', SavedJobController.getSavedJobsCount);

/**
 * @route   GET /api/saved-jobs/:jobId/check
 * @desc    Check if a job is saved
 * @access  Private
 */
router.get('/:jobId/check', SavedJobController.checkSaved);

/**
 * @route   POST /api/saved-jobs
 * @desc    Save a job
 * @access  Private
 */
router.post('/', SavedJobController.saveJob);

/**
 * @route   DELETE /api/saved-jobs/:jobId
 * @desc    Unsave a job
 * @access  Private
 */
router.delete('/:jobId', SavedJobController.unsaveJob);

module.exports = router;
