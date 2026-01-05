const express = require('express');
const router = express.Router();
const FollowedCompanyController = require('../controllers/followed_company.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Followed Company Routes
 * Base path: /api/followed-companies
 * All routes require authentication
 */

// Apply authentication to all routes
router.use(authMiddleware.authenticate);

/**
 * @route   GET /api/followed-companies
 * @desc    Get all followed companies for authenticated user
 * @access  Private
 */
router.get('/', FollowedCompanyController.getFollowedCompanies);

/**
 * @route   GET /api/followed-companies/count
 * @desc    Get count of followed companies
 * @access  Private
 */
router.get('/count', FollowedCompanyController.getFollowedCompaniesCount);

/**
 * @route   GET /api/followed-companies/:companyId/check
 * @desc    Check if a company is followed
 * @access  Private
 */
router.get('/:companyId/check', FollowedCompanyController.checkFollowed);

/**
 * @route   POST /api/followed-companies
 * @desc    Follow a company
 * @access  Private
 */
router.post('/', FollowedCompanyController.followCompany);

/**
 * @route   POST /api/followed-companies/:companyId/toggle
 * @desc    Toggle follow status for a company
 * @access  Private
 */
router.post('/:companyId/toggle', FollowedCompanyController.toggleFollow);

/**
 * @route   DELETE /api/followed-companies/:companyId
 * @desc    Unfollow a company
 * @access  Private
 */
router.delete('/:companyId', FollowedCompanyController.unfollowCompany);

module.exports = router;
