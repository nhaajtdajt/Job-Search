const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const NotificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const RoleMiddleware = require('../middlewares/role.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * Admin Routes
 * All routes require authentication and admin role
 */

// Get all users
router.get(
  '/users',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.getUsers
);

// Update user status
router.put(
  '/users/:userId/status',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.updateUserStatus
);

// Get all employers
router.get(
  '/employers',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.getEmployers
);

// Verify employer
router.put(
  '/employers/:employerId/verify',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.verifyEmployer
);

// Get all companies
router.get(
  '/companies',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.getCompanies
);

// Get all jobs
router.get(
  '/jobs',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.getJobs
);

// Delete job
router.delete(
  '/jobs/:jobId',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.deleteJob
);

// Get statistics
router.get(
  '/statistics',
  authMiddleware.authenticate,
  RoleMiddleware.requireAdmin(),
  AdminController.getStatistics
);

// POST /api/admin/notifications - Send notification to users
router.post('/notifications',
    authenticate,
    authorize(['admin']),
    NotificationController.sendAdminNotification
);

module.exports = router;
