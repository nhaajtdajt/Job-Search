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

// ==========================================
// Education Routes
// ==========================================

// Add education to resume
router.post(
  '/:resumeId/education',
  authMiddleware.authenticate,
  ResumeController.addEducation
);

// Update education
router.put(
  '/:resumeId/education/:educationId',
  authMiddleware.authenticate,
  ResumeController.updateEducation
);

// Delete education
router.delete(
  '/:resumeId/education/:educationId',
  authMiddleware.authenticate,
  ResumeController.deleteEducation
);

// ==========================================
// Experience Routes
// ==========================================

// Add experience to resume
router.post(
  '/:resumeId/experience',
  authMiddleware.authenticate,
  ResumeController.addExperience
);

// Update experience
router.put(
  '/:resumeId/experience/:experienceId',
  authMiddleware.authenticate,
  ResumeController.updateExperience
);

// Delete experience
router.delete(
  '/:resumeId/experience/:experienceId',
  authMiddleware.authenticate,
  ResumeController.deleteExperience
);

// ==========================================
// Skills Routes
// ==========================================

// Add skills to resume
router.post(
  '/:resumeId/skills',
  authMiddleware.authenticate,
  ResumeController.addSkills
);

// Remove skill from resume
router.delete(
  '/:resumeId/skills/:skillId',
  authMiddleware.authenticate,
  ResumeController.removeSkill
);

module.exports = router;
