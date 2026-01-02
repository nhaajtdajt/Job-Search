const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const SavedJobController = require('../controllers/saved_job.controller');
const SavedSearchController = require('../controllers/saved_search.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadAvatarSafe } = require('../middlewares/upload.middleware');

/**
 * User Routes
 * All routes require authentication
 */

// Get user profile
router.get(
  '/profile',
  authMiddleware.authenticate,
  UserController.getProfile
);

// Update user profile
router.put(
  '/profile',
  authMiddleware.authenticate,
  UserController.updateProfile
);

// Change password
router.post(
  '/change-password',
  authMiddleware.authenticate,
  UserController.changePassword
);

// Upload avatar
router.post(
  '/avatar',
  authMiddleware.authenticate,
  uploadAvatarSafe,
  UserController.uploadAvatar
);

// Delete avatar
router.delete(
  '/avatar',
  authMiddleware.authenticate,
  UserController.deleteAvatar
);

// Statistics endpoint (must be before saved-jobs/:jobId routes)
router.get(
  '/statistics',
  authMiddleware.authenticate,
  UserController.getStatistics
);

// Saved Jobs routes
router.post(
  '/saved-jobs',
  authMiddleware.authenticate,
  SavedJobController.saveJob
);

router.get(
  '/saved-jobs/count',
  authMiddleware.authenticate,
  SavedJobController.getSavedJobsCount
);

router.get(
  '/saved-jobs',
  authMiddleware.authenticate,
  SavedJobController.getSavedJobs
);

router.get(
  '/saved-jobs/:jobId/check',
  authMiddleware.authenticate,
  SavedJobController.checkSaved
);

router.delete(
  '/saved-jobs/:jobId',
  authMiddleware.authenticate,
  SavedJobController.unsaveJob
);

// Saved Searches routes
router.post(
  '/saved-searches',
  authMiddleware.authenticate,
  SavedSearchController.saveSearch
);

router.get(
  '/saved-searches/count',
  authMiddleware.authenticate,
  SavedSearchController.getSavedSearchesCount
);

router.get(
  '/saved-searches',
  authMiddleware.authenticate,
  SavedSearchController.getSavedSearches
);

router.delete(
  '/saved-searches/:searchId',
  authMiddleware.authenticate,
  SavedSearchController.deleteSearch
);

// ==================================================
// EMPLOYER ROUTES - View candidate info
// ==================================================

// Get candidate profile by ID (for employers)
router.get(
  '/:userId/profile',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  UserController.getCandidateProfile
);

// Get candidate's applications for this employer (for employers)
router.get(
  '/:userId/applications',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  UserController.getCandidateApplications
);

module.exports = router;
