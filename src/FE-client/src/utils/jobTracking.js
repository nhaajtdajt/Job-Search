/**
 * Job Tracking Utilities
 * Helper functions to automatically track job views and searches
 */

import { userService } from '../services/user.service';

/**
 * Automatically save a job when user views it
 * This should be called when a user views a job detail page
 * @param {number} jobId - Job ID
 * @returns {Promise<void>}
 */
export const trackJobView = async (jobId) => {
  try {
    // Only track if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token || !jobId) {
      return;
    }

    // Save job (will update saved_at if already exists)
    await userService.saveJob(jobId);
  } catch (error) {
    // Silently fail - tracking should not break the user experience
    console.warn('Failed to track job view:', error);
  }
};

/**
 * Automatically save a search when user performs a search
 * This should be called when a user searches for jobs
 * @param {Object} searchFilters - Search filters object
 * @param {string} searchName - Optional custom name for the search
 * @returns {Promise<void>}
 */
export const trackJobSearch = async (searchFilters, searchName = null) => {
  try {
    // Only track if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (!token || !searchFilters) {
      return;
    }

    // Create a default name if not provided
    const name = searchName || generateSearchName(searchFilters);

    // Save search
    await userService.saveSearch({
      name,
      filter: searchFilters
    });
  } catch (error) {
    // Silently fail - tracking should not break the user experience
    console.warn('Failed to track job search:', error);
  }
};

/**
 * Generate a search name from filters
 * @param {Object} filters - Search filters
 * @returns {string} Generated search name
 */
const generateSearchName = (filters) => {
  const parts = [];
  
  if (filters.keyword) {
    parts.push(filters.keyword);
  }
  
  if (filters.location) {
    parts.push(filters.location);
  }
  
  if (filters.job_type) {
    parts.push(filters.job_type);
  }
  
  return parts.length > 0 
    ? parts.join(' • ')
    : 'Tìm kiếm không tên';
};

