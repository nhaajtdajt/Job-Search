const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/company.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const{ uploadLogoSafe, uploadBannerSafe } = require('../middlewares/upload.middleware');

/**
 * Company Routes
 */

// Get all companies (public)
router.get('/', CompanyController.getAll);

// Create company (requires admin auth - TODO: add admin middleware)
router.post(
  '/',
  authMiddleware.authenticate,
  CompanyController.create
);

// Get company by ID (public)
router.get('/:companyId', CompanyController.getById);

// Update company (requires employer/admin auth - TODO: add permission check)
router.put(
  '/:companyId',
  authMiddleware.authenticate,
  CompanyController.update
);

// Delete company (requires admin auth - TODO: add admin middleware)
router.delete(
  '/:companyId',
  authMiddleware.authenticate,
  CompanyController.delete
);

// Get jobs by company ID (public)
router.get('/:companyId/jobs', CompanyController.getCompanyJobs);

// Upload company logo (requires employer auth)
router.post(
  '/:companyId/logo',
  authMiddleware.authenticate,
  uploadLogoSafe,
  CompanyController.uploadLogo
);

// Upload company banner (requires employer auth)
router.post(
  '/:companyId/banner',
  authMiddleware.authenticate,
  uploadBannerSafe,
  CompanyController.uploadBanner
);

// Delete company logo (requires employer auth)
router.delete(
  '/:companyId/logo',
  authMiddleware.authenticate,
  CompanyController.deleteLogo
);

// Delete company banner (requires employer auth)
router.delete(
  '/:companyId/banner',
  authMiddleware.authenticate,
  CompanyController.deleteBanner
);

module.exports = router;
