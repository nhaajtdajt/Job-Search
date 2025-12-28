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

// Get company by ID (public)
router.get('/:companyId', CompanyController.getById);

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
