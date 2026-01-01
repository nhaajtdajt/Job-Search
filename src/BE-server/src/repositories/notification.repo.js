const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Notification Repository
 * Data access layer for notification table
 */
class NotificationRepository {
    /**
     * Generate notification ID (NTF + random)
     * @returns {string} Notification ID
     */
    static generateId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'NTF';
        for (let i = 0; i < 7; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Create a notification
     * @param {Object} data - { user_id, title, note }
     * @returns {Object} Created notification
     */
    static async create(data) {
        const [notification] = await db(MODULE.NOTIFICATION)
            .insert({
                notification_id: this.generateId(),
                user_id: data.user_id,
                title: data.title || null,
                note: data.note,
                seen: false,
                created_at: new Date()
            })
            .returning('*');

        return notification;
    }

    /**
     * Create multiple notifications (bulk insert for broadcast)
     * @param {Array} notifications - Array of { user_id, title, note }
     * @returns {number} Number of inserted rows
     */
    static async createBulk(notifications) {
        const records = notifications.map(n => ({
            notification_id: this.generateId(),
            user_id: n.user_id,
            title: n.title || null,
            note: n.note,
            seen: false,
            created_at: new Date()
        }));

        const result = await db(MODULE.NOTIFICATION).insert(records);
        return result.rowCount || records.length;
    }

    /**
     * Find notifications by user ID with pagination
     * @param {string} userId - User ID
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Object} { data, total, page, limit }
     */
    static async findByUserId(userId, page = 1, limit = 20) {
        const { offset } = parsePagination(page, limit);

        // Get total count
        const [{ total }] = await db(MODULE.NOTIFICATION)
            .where('user_id', userId)
            .count('* as total');

        // Get notifications
        const data = await db(MODULE.NOTIFICATION)
            .where('user_id', userId)
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        return {
            data,
            total: parseInt(total, 10),
            page,
            limit
        };
    }

    /**
     * Find notification by ID
     * @param {string} notificationId - Notification ID
     * @returns {Object|null} Notification or null
     */
    static async findById(notificationId) {
        return await db(MODULE.NOTIFICATION)
            .where('notification_id', notificationId)
            .first();
    }

    /**
     * Count unread notifications for user
     * @param {string} userId - User ID
     * @returns {number} Unread count
     */
    static async countUnread(userId) {
        const [{ count }] = await db(MODULE.NOTIFICATION)
            .where({ user_id: userId, seen: false })
            .count('* as count');

        return parseInt(count, 10);
    }

    /**
     * Mark notification as read
     * @param {string} notificationId - Notification ID
     * @returns {Object} Updated notification
     */
    static async markAsRead(notificationId) {
        const [notification] = await db(MODULE.NOTIFICATION)
            .where('notification_id', notificationId)
            .update({ seen: true })
            .returning('*');

        return notification;
    }

    /**
     * Mark all notifications as read for user
     * @param {string} userId - User ID
     * @returns {number} Number of updated rows
     */
    static async markAllAsRead(userId) {
        return await db(MODULE.NOTIFICATION)
            .where({ user_id: userId, seen: false })
            .update({ seen: true });
    }

    /**
     * Delete notification by ID
     * @param {string} notificationId - Notification ID
     * @returns {number} Number of deleted rows
     */
    static async delete(notificationId) {
        return await db(MODULE.NOTIFICATION)
            .where('notification_id', notificationId)
            .del();
    }

    /**
     * Check if notification belongs to user
     * @param {string} notificationId - Notification ID
     * @param {string} userId - User ID
     * @returns {boolean}
     */
    static async isOwnedByUser(notificationId, userId) {
        const notification = await db(MODULE.NOTIFICATION)
            .where({ notification_id: notificationId, user_id: userId })
            .first();

        return !!notification;
    }
}

module.exports = NotificationRepository;
