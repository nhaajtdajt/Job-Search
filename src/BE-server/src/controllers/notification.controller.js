const NotificationService = require('../services/notification.service');
const HTTP_STATUS = require('../constants/http-status');
const ResponseHandler = require('../utils/response-handler');

/**
 * Notification Controller
 * Handles notification-related HTTP requests
 */
class NotificationController {
    /**
     * Get user's notifications
     * GET /api/notifications
     */
    static async getNotifications(req, res, next) {
        try {
            const userId = req.user.user_id;
            const { page = 1, limit = 20 } = req.query;

            const result = await NotificationService.getNotifications(
                userId,
                parseInt(page),
                parseInt(limit)
            );

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: 'Notifications retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get unread notification count
     * GET /api/notifications/unread-count
     */
    static async getUnreadCount(req, res, next) {
        try {
            const userId = req.user.user_id;
            const result = await NotificationService.getUnreadCount(userId);

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: 'Unread count retrieved successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark notification as read
     * PUT /api/notifications/:notificationId/read
     */
    static async markAsRead(req, res, next) {
        try {
            const userId = req.user.user_id;
            const { notificationId } = req.params;

            const result = await NotificationService.markAsRead(notificationId, userId);

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: 'Notification marked as read',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Mark all notifications as read
     * PUT /api/notifications/read-all
     */
    static async markAllAsRead(req, res, next) {
        try {
            const userId = req.user.user_id;
            const result = await NotificationService.markAllAsRead(userId);

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: 'All notifications marked as read',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete notification
     * DELETE /api/notifications/:notificationId
     */
    static async deleteNotification(req, res, next) {
        try {
            const userId = req.user.user_id;
            const { notificationId } = req.params;

            const result = await NotificationService.deleteNotification(notificationId, userId);

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Admin: Send notification to users
     * POST /api/admin/notifications
     */
    static async sendAdminNotification(req, res, next) {
        try {
            const { message, target_role, target_user_id } = req.body;

            const result = await NotificationService.createAdminNotification({
                message,
                target_role,
                target_user_id
            });

            return ResponseHandler.success(res, {
                status: HTTP_STATUS.OK,
                message: result.message,
                data: { recipients: result.recipients }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = NotificationController;
