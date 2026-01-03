const express = require('express');
const router = express.Router();
const EmployerController = require('../controllers/employer.controller');
const EmployerSettingsController = require('../controllers/employer-settings.controller');
const ApplicationController = require('../controllers/application.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadAvatarSafe } = require('../middlewares/upload.middleware');

/**
 * Employer Routes
 * All routes require authentication with employer role
 */

// ============== SETTINGS ROUTES ==============

// Get employer settings
router.get(
  '/settings',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  EmployerSettingsController.getSettings
);

// Update employer settings
router.put(
  '/settings',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  EmployerSettingsController.updateSettings
);

// ============== ACCOUNT MANAGEMENT ROUTES ==============

// Get account status
router.get(
  '/account/status',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  EmployerSettingsController.getAccountStatus
);

// Suspend account
router.post(
  '/account/suspend',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  EmployerSettingsController.suspendAccount
);

// Reactivate account
router.post(
  '/account/reactivate',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  EmployerSettingsController.reactivateAccount
);

// Delete account
router.delete(
  '/account',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  EmployerSettingsController.deleteAccount
);

// ============== PROFILE ROUTES ==============

// Get employer profile
router.get(
  '/profile',
  authMiddleware.authenticate,
  EmployerController.getProfile
);

// Update employer profile
router.put(
  '/profile',
  authMiddleware.authenticate,
  EmployerController.updateProfile
);

// Upload employer avatar
router.post(
  '/avatar',
  authMiddleware.authenticate,
  uploadAvatarSafe,
  EmployerController.uploadAvatar
);

// Delete employer avatar
router.delete(
  '/avatar',
  authMiddleware.authenticate,
  EmployerController.deleteAvatar
);

// Get all applications for employer's jobs
router.get(
  '/applications',
  authMiddleware.authenticate,
  authMiddleware.authorize(['employer']),
  ApplicationController.getEmployerApplications
);

// Get public employer profile (no auth required) - must be after /profile route
router.get(
  '/:employerId',
  EmployerController.getPublicProfile
);

// Get jobs by employer ID (no auth required)
router.get(
  '/:employerId/jobs',
  EmployerController.getEmployerJobs
);

module.exports = router;
