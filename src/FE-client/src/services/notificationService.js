import api from './api';

/**
 * Notification Service
 * API calls for notification management
 */
const notificationService = {
  /**
   * Get notifications with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} { data, total, page, limit }
   */
  getNotifications: async (page = 1, limit = 20) => {
    const response = await api.get('/notifications', {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * Get unread notification count
   * @returns {Promise<Object>} { count }
   */
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise<Object>} { updated }
   */
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Success message
   */
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

export default notificationService;
