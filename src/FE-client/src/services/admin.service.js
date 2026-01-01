import { apiService } from './api';

/**
 * Admin Service
 * API calls for admin functionality
 */
const adminService = {
    /**
     * Get admin statistics
     * @returns {Promise} Statistics data
     */
    getStatistics: () => apiService.get('/admin/statistics'),

    // ============ USERS ============
    /**
     * Get all users with pagination
     * @param {Object} params - { page, limit, search, status, role }
     */
    getUsers: (params = {}) => apiService.get('/admin/users', { params }),

    /**
     * Update user status (block/unblock)
     * @param {string} userId
     * @param {string} status - 'active' or 'blocked'
     */
    updateUserStatus: (userId, status) =>
        apiService.put(`/admin/users/${userId}/status`, { status }),

    // ============ EMPLOYERS ============
    /**
     * Get all employers with pagination
     * @param {Object} params - { page, limit, search, status }
     */
    getEmployers: (params = {}) => apiService.get('/admin/employers', { params }),

    /**
     * Verify or suspend employer
     * @param {string} employerId
     * @param {string} status - 'verified' or 'suspended'
     */
    verifyEmployer: (employerId, status) =>
        apiService.put(`/admin/employers/${employerId}/verify`, { status }),

    // ============ COMPANIES ============
    /**
     * Get all companies with pagination
     * @param {Object} params - { page, limit, search, status }
     */
    getCompanies: (params = {}) => apiService.get('/admin/companies', { params }),

    // ============ JOBS ============
    /**
     * Get all jobs with pagination
     * @param {Object} params - { page, limit, search, status, category }
     */
    getJobs: (params = {}) => apiService.get('/admin/jobs', { params }),

    /**
     * Delete a job
     * @param {string} jobId
     */
    deleteJob: (jobId) => apiService.delete(`/admin/jobs/${jobId}`),

    // ============ NOTIFICATIONS ============
    /**
     * Send broadcast notification
     * @param {Object} data - { title, message, target_role, target_user_id }
     */
    sendNotification: (data) => apiService.post('/admin/notifications', data),
};

export default adminService;
