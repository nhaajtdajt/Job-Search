const express = require('express');
const router = express.Router();
const SavedSearchController = require('../controllers/saved_search.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Saved Search Routes
 * Base path: /api/saved-searches
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authMiddleware.authenticate);

/**
 * @route   GET /api/saved-searches
 * @desc    Get all saved searches for authenticated user
 * @access  Private
 */
router.get('/', SavedSearchController.getSavedSearches);

/**
 * @route   GET /api/saved-searches/count
 * @desc    Get count of saved searches
 * @access  Private
 */
router.get('/count', SavedSearchController.getSavedSearchesCount);

/**
 * @route   GET /api/saved-searches/:searchId/jobs
 * @desc    Get matching jobs for a saved search
 * @access  Private
 */
router.get('/:searchId/jobs', SavedSearchController.getMatchingJobs);

/**
 * @route   POST /api/saved-searches
 * @desc    Save a new search
 * @access  Private
 */
router.post('/', SavedSearchController.saveSearch);

/**
 * @route   PUT /api/saved-searches/:searchId
 * @desc    Update a saved search
 * @access  Private
 */
router.put('/:searchId', SavedSearchController.updateSearch);

/**
 * @route   PATCH /api/saved-searches/:searchId/notification
 * @desc    Toggle email notification for a saved search
 * @access  Private
 */
router.patch('/:searchId/notification', SavedSearchController.toggleNotification);

/**
 * @route   DELETE /api/saved-searches/:searchId
 * @desc    Delete a saved search
 * @access  Private
 */
router.delete('/:searchId', SavedSearchController.deleteSearch);

module.exports = router;
