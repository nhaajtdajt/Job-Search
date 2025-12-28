const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
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

module.exports = router;
