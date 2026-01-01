const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

/**
 * Notification Routes
 * All routes require authentication
 */

// GET /api/notifications - Get user's notifications
router.get('/',
    authenticate,
    NotificationController.getNotifications
);

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count',
    authenticate,
    NotificationController.getUnreadCount
);

// PUT /api/notifications/read-all - Mark all as read (must be before :notificationId)
router.put('/read-all',
    authenticate,
    NotificationController.markAllAsRead
);

// PUT /api/notifications/:notificationId/read - Mark as read
router.put('/:notificationId/read',
    authenticate,
    NotificationController.markAsRead
);

// DELETE /api/notifications/:notificationId - Delete notification
router.delete('/:notificationId',
    authenticate,
    NotificationController.deleteNotification
);

module.exports = router;
