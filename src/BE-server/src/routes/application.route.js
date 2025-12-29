const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * Job Seeker Routes
 * All routes require authentication as job_seeker
 */

// POST /api/applications - Submit application
router.post('/',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.applyJob
);

// GET /api/applications/statistics - Get statistics (must be before /:applicationId)
router.get('/statistics',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.getApplicationStatistics
);

// GET /api/applications - Get user's applications
router.get('/',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.getUserApplications
);

// GET /api/applications/:applicationId - Get application detail
router.get('/:applicationId',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.getApplicationById
);

// PUT /api/applications/:applicationId - Update application
router.put('/:applicationId',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.updateApplication
);

// DELETE /api/applications/:applicationId - Withdraw application
router.delete('/:applicationId',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.withdrawApplication
);

/**
 * Employer Routes
 * Require authentication as employer
 */

// PUT /api/applications/:applicationId/status - Update status (employer)
router.put('/:applicationId/status',
  authenticate,
  authorize(['employer']),
  ApplicationController.updateApplicationStatus
);

// POST /api/applications/:applicationId/notes - Add notes (employer)
router.post('/:applicationId/notes',
  authenticate,
  authorize(['employer']),
  ApplicationController.addApplicationNotes
);

module.exports = router;
