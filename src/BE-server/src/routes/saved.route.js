const express = require('express');
const router = express.Router();
const SavedController = require('../controllers/saved.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * Saved Jobs Routes
 * All routes require authentication as job_seeker
 */

// GET /api/saved-jobs/check/:jobId - Check if saved (must be before /:jobId)
router.get('/check/:jobId',
  authenticate,
  authorize(['job_seeker']),
  SavedController.checkJobSaved
);

// GET /api/saved-jobs - Get saved jobs list
router.get('/',
  authenticate,
  authorize(['job_seeker']),
  SavedController.getSavedJobs
);

// POST /api/saved-jobs/:jobId - Save job
router.post('/:jobId',
  authenticate,
  authorize(['job_seeker']),
  SavedController.saveJob
);

// DELETE /api/saved-jobs/:jobId - Unsave job
router.delete('/:jobId',
  authenticate,
  authorize(['job_seeker']),
  SavedController.unsaveJob
);

module.exports = router;
