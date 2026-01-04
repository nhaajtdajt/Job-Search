const express = require('express');
const router = express.Router();
const EmployerSettingsController = require('../controllers/employer-settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * Employer Settings Routes
 * Base path: /api/employer-settings
 * All routes require authentication with employer role
 */

// Apply authentication to all routes
router.use(authMiddleware.authenticate);
router.use(authMiddleware.authorize(['employer']));

/**
 * @route   GET /api/employer-settings
 * @desc    Get employer settings
 * @access  Private (Employer)
 */
router.get('/', EmployerSettingsController.getSettings);

/**
 * @route   PUT /api/employer-settings
 * @desc    Update employer settings
 * @access  Private (Employer)
 */
router.put('/', EmployerSettingsController.updateSettings);

/**
 * @route   GET /api/employer-settings/account/status
 * @desc    Get account status
 * @access  Private (Employer)
 */
router.get('/account/status', EmployerSettingsController.getAccountStatus);

/**
 * @route   POST /api/employer-settings/account/suspend
 * @desc    Suspend employer account
 * @access  Private (Employer)
 */
router.post('/account/suspend', EmployerSettingsController.suspendAccount);

/**
 * @route   POST /api/employer-settings/account/reactivate
 * @desc    Reactivate employer account
 * @access  Private (Employer)
 */
router.post('/account/reactivate', EmployerSettingsController.reactivateAccount);

/**
 * @route   DELETE /api/employer-settings/account
 * @desc    Delete employer account
 * @access  Private (Employer)
 */
router.delete('/account', EmployerSettingsController.deleteAccount);

module.exports = router;
