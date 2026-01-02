const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/search.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * Search Routes
 */

// ============ PUBLIC ROUTES ============
// GET /api/search/suggestions - Get search suggestions (autocomplete)
router.get('/suggestions', SearchController.getSuggestions);

// ============ PROTECTED ROUTES (job_seeker only) ============
// GET /api/searches - Get saved searches
router.get('/',
  authenticate,
  authorize(['job_seeker']),
  SearchController.getSavedSearches
);

// POST /api/searches - Create saved search
router.post('/',
  authenticate,
  authorize(['job_seeker']),
  SearchController.createSavedSearch
);

// PUT /api/searches/:searchId - Update saved search
router.put('/:searchId',
  authenticate,
  authorize(['job_seeker']),
  SearchController.updateSavedSearch
);

// DELETE /api/searches/:searchId - Delete saved search
router.delete('/:searchId',
  authenticate,
  authorize(['job_seeker']),
  SearchController.deleteSavedSearch
);

module.exports = router;
