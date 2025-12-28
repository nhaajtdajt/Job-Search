const express = require('express');
const router = express.Router();
const ResumeController = require('../controllers/resume.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { uploadCVSafe } = require('../middlewares/upload.middleware');

/**
 * Resume Routes
 * All routes require authentication
 */

// Get all resumes for authenticated user
router.get(
  '/',
  authMiddleware.authenticate,
  ResumeController.getAll
);

// Get resume by ID
router.get(
  '/:resumeId',
  authMiddleware.authenticate,
  ResumeController.getById
);

// Create new resume
router.post(
  '/',
  authMiddleware.authenticate,
  ResumeController.create
);

// Update resume
router.put(
  '/:resumeId',
  authMiddleware.authenticate,
  ResumeController.update
);

// Delete resume
router.delete(
  '/:resumeId',
  authMiddleware.authenticate,
  ResumeController.delete
);

// Upload CV PDF
router.post(
  '/:resumeId/upload',
  authMiddleware.authenticate,
  uploadCVSafe,
  ResumeController.uploadCV
);

// Download CV PDF
router.get(
  '/:resumeId/download',
  authMiddleware.authenticate,
  ResumeController.downloadCV
);

// Delete CV file
router.delete(
  '/:resumeId/cv',
  authMiddleware.authenticate,
  ResumeController.deleteCV
);

module.exports = router;
