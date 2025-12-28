const express = require('express');
const router = express.Router();
const EmployerController = require('../controllers/employer.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadAvatarSafe } = require('../middlewares/upload.middleware');

/**
 * Employer Routes
 * All routes require authentication with employer role
 */

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

module.exports = router;
