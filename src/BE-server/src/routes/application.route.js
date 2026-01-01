const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/application.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * Application Routes
 * 
 * IMPORTANT: Specific routes MUST come BEFORE parameterized routes (/:applicationId)
 * Otherwise Express will match 'employer' or 'statistics' as applicationId
 */

// ============================================================
// EMPLOYER ROUTES (must be before /:applicationId)
// ============================================================

// GET /api/applications/employer - Get all applications for employer's jobs
router.get('/employer',
  authenticate,
  authorize(['employer']),
  ApplicationController.getEmployerApplications
);

// GET /api/applications/employer/:applicationId - Get application detail for employer
router.get('/employer/:applicationId',
  authenticate,
  authorize(['employer']),
  ApplicationController.getApplicationByIdForEmployer
);

// PUT /api/applications/bulk-status - Bulk update application status (employer)
router.put('/bulk-status',
  authenticate,
  authorize(['employer']),
  ApplicationController.bulkUpdateStatus
);

// ============================================================
// JOB SEEKER ROUTES
// ============================================================

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

// GET /api/applications/:applicationId - Get application detail (job seeker)
router.get('/:applicationId',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.getApplicationById
);

// PUT /api/applications/:applicationId - Update application (job seeker)
router.put('/:applicationId',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.updateApplication
);

// DELETE /api/applications/:applicationId - Withdraw application (job seeker)
router.delete('/:applicationId',
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.withdrawApplication
);

// ============================================================
// EMPLOYER STATUS & NOTES ROUTES
// ============================================================

// PUT /api/applications/:applicationId/status - Update status (employer)
router.put('/:applicationId/status',
  authenticate,
  authorize(['employer']),
  ApplicationController.updateApplicationStatus
);

// GET /api/applications/:applicationId/notes - Get notes (employer)
router.get('/:applicationId/notes',
  authenticate,
  authorize(['employer']),
  ApplicationController.getApplicationNotes
);

// POST /api/applications/:applicationId/notes - Add notes (employer)
router.post('/:applicationId/notes',
  authenticate,
  authorize(['employer']),
  ApplicationController.addApplicationNotes
);

module.exports = router;
