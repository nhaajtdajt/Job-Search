const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * Admin Routes
 * All routes require admin authentication
 */

// POST /api/admin/notifications - Send notification to users
router.post('/notifications',
    authenticate,
    authorize(['admin']),
    NotificationController.sendAdminNotification
);

module.exports = router;
