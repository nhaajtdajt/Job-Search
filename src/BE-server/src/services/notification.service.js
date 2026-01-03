const NotificationRepository = require('../repositories/notification.repo');
const UserRepository = require('../repositories/user.repo');
const AppError = require('../errors/app.error');
const { emitToUser, emitToAll } = require('../configs/socket');

/**
 * Notification Service
 * Business logic for notifications
 */
class NotificationService {
    /**
     * Get user's notifications with pagination
     * @param {string} userId - User ID
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Object} Paginated notifications
     */
    static async getNotifications(userId, page = 1, limit = 20) {
        return await NotificationRepository.findByUserId(userId, page, limit);
    }

    /**
     * Get unread notification count
     * @param {string} userId - User ID
     * @returns {Object} { count }
     */
    static async getUnreadCount(userId) {
        const count = await NotificationRepository.countUnread(userId);
        return { count };
    }

    /**
     * Mark notification as read
     * @param {string} notificationId - Notification ID
     * @param {string} userId - User ID (for ownership check)
     * @returns {Object} Updated notification
     */
    static async markAsRead(notificationId, userId) {
        // Check if notification exists
        const notification = await NotificationRepository.findById(notificationId);
        if (!notification) {
            throw new AppError(`Notification ${notificationId} not found`, 404);
        }

        // Check ownership
        if (notification.user_id !== userId) {
            throw new AppError('You can only mark your own notifications as read', 403);
        }

        return await NotificationRepository.markAsRead(notificationId);
    }

    /**
     * Mark all notifications as read
     * @param {string} userId - User ID
     * @returns {Object} { updated }
     */
    static async markAllAsRead(userId) {
        const updated = await NotificationRepository.markAllAsRead(userId);
        return { updated };
    }

    /**
     * Delete notification
     * @param {string} notificationId - Notification ID
     * @param {string} userId - User ID (for ownership check)
     * @returns {Object} Success message
     */
    static async deleteNotification(notificationId, userId) {
        // Check if notification exists
        const notification = await NotificationRepository.findById(notificationId);
        if (!notification) {
            throw new AppError(`Notification ${notificationId} not found`, 404);
        }

        // Check ownership
        if (notification.user_id !== userId) {
            throw new AppError('You can only delete your own notifications', 403);
        }

        await NotificationRepository.delete(notificationId);
        return { message: 'Notification deleted successfully' };
    }

    /**
     * Create notification for a user (internal use)
     * @param {string} userId - User ID
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {Object} metadata - Optional metadata { type, application_id, job_id, etc. }
     * @returns {Object} Created notification
     */
    static async createNotification(userId, title, message, metadata = null) {
        const notification = await NotificationRepository.create({
            user_id: userId,
            title: title,
            note: message,
            metadata: metadata
        });

        // Emit real-time notification to user
        try {
            const unreadCount = await NotificationRepository.countUnread(userId);
            emitToUser(userId, 'new_notification', {
                notification,
                unreadCount
            });
        } catch (error) {
            console.error('[NotificationService] Error emitting notification:', error.message);
        }

        return notification;
    }

    /**
     * Send notification from Admin
     * @param {Object} data - { title, message, target_role, target_user_id }
     * @returns {Object} Result
     */
    static async createAdminNotification(data) {
        const { title, message, target_role, target_user_id } = data;

        // Validate message
        if (!message || !message.trim()) {
            throw new AppError('Message is required', 400);
        }

        // If targeting specific user
        if (target_user_id) {
            const user = await UserRepository.findById(target_user_id);
            if (!user) {
                throw new AppError(`User ${target_user_id} not found`, 404);
            }

            const notification = await NotificationRepository.create({
                user_id: target_user_id,
                title: title ? title.trim() : null,
                note: message.trim()
            });

            // Emit real-time notification
            try {
                const unreadCount = await NotificationRepository.countUnread(target_user_id);
                emitToUser(target_user_id, 'new_notification', {
                    notification,
                    unreadCount
                });
            } catch (error) {
                console.error('[NotificationService] Error emitting notification:', error.message);
            }

            return {
                message: 'Notification sent successfully',
                recipients: 1,
                notification
            };
        }

        // Get users by role
        let users = [];
        const db = require('../databases/knex');
        const MODULE = require('../constants/module');

        if (target_role === 'all') {
            // Get all users from users table
            const result = await UserRepository.findAll(1, 10000);
            users = result.data || [];
        } else if (target_role === 'job_seeker') {
            // All users in users table are job seekers (not employers)
            const result = await UserRepository.findAll(1, 10000);
            users = result.data || [];
        } else if (target_role === 'employer') {
            // Get employers from employer table (they have user_id reference)
            const employers = await db(MODULE.EMPLOYER)
                .select('user_id')
                .whereNotNull('user_id');
            users = employers;
        } else {
            throw new AppError('Invalid target_role. Must be: all, job_seeker, or employer', 400);
        }

        if (!users || users.length === 0) {
            return { message: 'No users found for the target role', recipients: 0 };
        }

        // Create notifications for all users
        const notifications = users.map(user => ({
            user_id: user.user_id,
            title: title ? title.trim() : null,
            note: message.trim()
        }));

        const count = await NotificationRepository.createBulk(notifications);

        // Emit real-time notifications to all targeted users
        try {
            for (const user of users) {
                const unreadCount = await NotificationRepository.countUnread(user.user_id);
                emitToUser(user.user_id, 'new_notification', {
                    notification: {
                        title: title ? title.trim() : null,
                        note: message.trim(),
                        seen: false
                    },
                    unreadCount
                });
            }
        } catch (error) {
            console.error('[NotificationService] Error emitting bulk notifications:', error.message);
        }

        return {
            message: 'Notifications sent successfully',
            recipients: count
        };
    }
}

module.exports = NotificationService;
