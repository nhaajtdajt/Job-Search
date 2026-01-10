/**
 * Resume Service
 * API service for Resume/CV management
 */
import { apiService } from './api';

const resumeService = {
  /**
   * Get all resumes for current user
   */
  getMyResumes: async () => {
    const response = await apiService.get('/resumes');
    return response.data;
  },

  /**
   * Get resume by ID
   * @param {string} resumeId 
   */
  getResumeById: async (resumeId) => {
    const response = await apiService.get(`/resumes/${resumeId}`);
    return response.data;
  },

  /**
   * Create new resume
   * @param {Object} resumeData - { resume_title, summary }
   */
  createResume: async (resumeData) => {
    const response = await apiService.post('/resumes', resumeData);
    return response.data;
  },

  /**
   * Update resume
   * @param {string} resumeId 
   * @param {Object} resumeData 
   */
  updateResume: async (resumeId, resumeData) => {
    const response = await apiService.put(`/resumes/${resumeId}`, resumeData);
    return response.data;
  },

  /**
   * Delete resume
   * @param {string} resumeId 
   */
  deleteResume: async (resumeId) => {
    const response = await apiService.delete(`/resumes/${resumeId}`);
    return response.data;
  },

  /**
   * Upload resume file (PDF)
   * @param {string} resumeId 
   * @param {File} file 
   */
  uploadResumeFile: async (resumeId, file) => {
    const formData = new FormData();
    formData.append('cv', file);
    
    const response = await apiService.post(`/resumes/${resumeId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete resume file (PDF)
   * @param {string} resumeId 
   */
  deleteResumeFile: async (resumeId) => {
    const response = await apiService.delete(`/resumes/${resumeId}/cv`);
    return response.data;
  },

  /**
   * Download resume file
   * @param {string} resumeId 
   */
  downloadResume: async (resumeId) => {
    const response = await apiService.get(`/resumes/${resumeId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get signed URL for viewing CV in browser
   * @param {string} resumeId 
   * @returns {Promise<{signedUrl: string, expiresIn: number, isExternal: boolean}>}
   */
  getViewUrl: async (resumeId) => {
    const response = await apiService.get(`/resumes/${resumeId}/view-url`);
    return response.data;
  },

  // ==========================================
  // Education
  // ==========================================

  /**
   * Add education to resume
   * @param {string} resumeId 
   * @param {Object} educationData - { school_name, major, degree, start_year, end_year }
   */
  addEducation: async (resumeId, educationData) => {
    const response = await apiService.post(`/resumes/${resumeId}/education`, educationData);
    return response.data;
  },

  /**
   * Update education
   * @param {string} resumeId 
   * @param {string} educationId 
   * @param {Object} educationData 
   */
  updateEducation: async (resumeId, educationId, educationData) => {
    const response = await apiService.put(`/resumes/${resumeId}/education/${educationId}`, educationData);
    return response.data;
  },

  /**
   * Delete education
   * @param {string} resumeId 
   * @param {string} educationId 
   */
  deleteEducation: async (resumeId, educationId) => {
    const response = await apiService.delete(`/resumes/${resumeId}/education/${educationId}`);
    return response.data;
  },

  // ==========================================
  // Experience
  // ==========================================

  /**
   * Add experience to resume
   * @param {string} resumeId 
   * @param {Object} experienceData - { job_title, company_name, start_date, end_date, description }
   */
  addExperience: async (resumeId, experienceData) => {
    const response = await apiService.post(`/resumes/${resumeId}/experience`, experienceData);
    return response.data;
  },

  /**
   * Update experience
   * @param {string} resumeId 
   * @param {string} experienceId 
   * @param {Object} experienceData 
   */
  updateExperience: async (resumeId, experienceId, experienceData) => {
    const response = await apiService.put(`/resumes/${resumeId}/experience/${experienceId}`, experienceData);
    return response.data;
  },

  /**
   * Delete experience
   * @param {string} resumeId 
   * @param {string} experienceId 
   */
  deleteExperience: async (resumeId, experienceId) => {
    const response = await apiService.delete(`/resumes/${resumeId}/experience/${experienceId}`);
    return response.data;
  },

  // ==========================================
  // Skills
  // ==========================================

  /**
   * Add skills to resume
   * @param {string} resumeId 
   * @param {Array} skills - [{ skill_id, level }]
   */
  addSkills: async (resumeId, skills) => {
    const response = await apiService.post(`/resumes/${resumeId}/skills`, { skills });
    return response.data;
  },

  /**
   * Remove skill from resume
   * @param {string} resumeId 
   * @param {string} skillId 
   */
  removeSkill: async (resumeId, skillId) => {
    const response = await apiService.delete(`/resumes/${resumeId}/skills/${skillId}`);
    return response.data;
  },

  /**
   * Get all available skills (for skill selector)
   */
  getAllSkills: async () => {
    const response = await apiService.get('/skills');
    return response.data;
  },
};

export default resumeService;
