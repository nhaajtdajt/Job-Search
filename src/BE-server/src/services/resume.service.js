/**
 * Resume Service
 * Business logic for resume/CV management
 */

const ResumeRepository = require('../repositories/resume.repo');
const StorageService = require('./storage.service');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors');

class ResumeService {
  /**
   * Get all resumes for a user
   * @param {string} userId - User ID
   * @returns {Array} List of resumes
   */
  static async getAllByUserId(userId) {
    return await ResumeRepository.findByUserId(userId);
  }

  /**
   * Get resume by ID
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID (for permission check)
   * @returns {Object} Resume details
   */
  static async getById(resumeId, userId) {
    const resume = await ResumeRepository.findById(resumeId);
    
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    // Check ownership
    if (resume.user_id !== userId) {
      throw new ForbiddenError('Not authorized to view this resume');
    }
    
    return resume;
  }

  /**
   * Create a new resume
   * @param {string} userId - User ID
   * @param {Object} resumeData - Resume data
   * @returns {Object} Created resume
   */
  static async create(userId, resumeData) {
    // Validate required fields
    if (!resumeData.resume_title) {
      throw new BadRequestError('Resume title is required');
    }

    // Generate resume ID (max 7 chars to fit DB varchar(7))
    const resumeId = 'R' + Date.now().toString().slice(-6);

    // Create resume
    const resume = await ResumeRepository.create({
      resume_id: resumeId,
      user_id: userId,
      resume_title: resumeData.resume_title,
      summary: resumeData.summary
    });

    // Add education if provided
    if (resumeData.education && resumeData.education.length > 0) {
      await ResumeRepository.addEducation(resumeId, resumeData.education);
    }

    // Add experience if provided
    if (resumeData.experience && resumeData.experience.length > 0) {
      await ResumeRepository.addExperience(resumeId, resumeData.experience);
    }

    // Add skills if provided
    if (resumeData.skills && resumeData.skills.length > 0) {
      await ResumeRepository.addSkills(resumeId, resumeData.skills);
    }

    return resume;
  }

  /**
   * Update resume
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID (for permission check)
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated resume
   */
  static async update(resumeId, userId, updateData) {
    // Check ownership
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to update this resume');
    }

    // Only allow certain fields
    const allowedFields = ['resume_title', 'summary', 'is_public'];
    
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const resume = await ResumeRepository.update(resumeId, filteredData);
    
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }
    
    return resume;
  }

  /**
   * Delete resume
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID (for permission check)
   */
  static async delete(resumeId, userId) {
    const resume = await ResumeRepository.findById(resumeId);
    
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }
    
    if (resume.user_id !== userId) {
      throw new ForbiddenError('Not authorized to delete this resume');
    }

    // Delete CV file if exists
    if (resume.resume_url) {
      try {
        await StorageService.deleteFile(resume.resume_url);
      } catch (err) {
        console.warn('Failed to delete CV file:', err.message);
      }
    }

    // Delete resume record
    await ResumeRepository.delete(resumeId);
  }

  /**
   * Upload resume PDF
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID (for permission check)
   * @param {Buffer} fileBuffer - PDF buffer
   * @returns {Object} Upload result with URL
   */
  static async uploadCV(resumeId, userId, fileBuffer) {
    if (!fileBuffer) {
      throw new BadRequestError('No CV file provided');
    }

    // Check if resume exists and belongs to user
    const resume = await ResumeRepository.findById(resumeId);
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }
    if (resume.user_id !== userId) {
      throw new ForbiddenError('Not authorized to update this resume');
    }

    // Delete old CV if exists
    if (resume.resume_url) {
      try {
        await StorageService.deleteFile(resume.resume_url);
      } catch (err) {
        console.warn('Failed to delete old CV:', err.message);
      }
    }

    // Upload new CV
    const result = await StorageService.uploadResumePDF(
      fileBuffer,
      userId,
      resumeId
    );

    // Update database
    await ResumeRepository.update(resumeId, {
      resume_url: result.url,
      updated_at: new Date()
    });

    return result;
  }

  /**
   * Download resume PDF
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID (optional, for permission check)
   * @param {number} employerId - Employer ID (optional, for permission check)
   * @returns {Buffer} PDF file buffer
   */
  static async downloadCV(resumeId, userId = null, employerId = null) {
    const resume = await ResumeRepository.findById(resumeId);
    
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }

    if (!resume.resume_url) {
      throw new NotFoundError('No CV file found for this resume');
    }

    // Check permission: user can download their own, or resume is public
    const canAccess = resume.user_id === userId || resume.is_public === true;
    // TODO: Add check for employer access via applications
    
    if (!canAccess && !employerId) {
      throw new ForbiddenError('Not authorized to download this CV');
    }

    // Download file
    const fileBuffer = await StorageService.downloadFile(resume.resume_url);
    return fileBuffer;
  }

  /**
   * Delete resume CV file
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID (for permission check)
   */
  static async deleteCV(resumeId, userId) {
    const resume = await ResumeRepository.findById(resumeId);
    
    if (!resume) {
      throw new NotFoundError('Resume not found');
    }
    
    if (resume.user_id !== userId) {
      throw new ForbiddenError('Not authorized to delete this CV');
    }

    if (!resume.resume_url) {
      throw new NotFoundError('No CV file found');
    }

    // Delete from storage (attempt)
    try {
      await StorageService.deleteFile(resume.resume_url);
    } catch (error) {
      console.warn(`Failed to delete file from storage: ${error.message} (ResumeID: ${resumeId})`);
      // Proceed to update DB even if storage delete fails
    }

    // Update database
    await ResumeRepository.update(resumeId, { resume_url: null });
  }

  // ==========================================
  // Education Operations
  // ==========================================

  /**
   * Add education to resume
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID (for permission check)
   * @param {Object} educationData - Education data
   * @returns {Object} Created education record
   */
  static async addEducation(resumeId, userId, educationData) {
    // Check ownership
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    return await ResumeRepository.addSingleEducation(resumeId, educationData);
  }

  /**
   * Update education record
   * @param {string} resumeId - Resume ID
   * @param {number} educationId - Education ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated education record
   */
  static async updateEducation(resumeId, userId, educationId, updateData) {
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    const education = await ResumeRepository.findEducationById(educationId);
    if (!education || education.resume_id !== resumeId) {
      throw new NotFoundError('Education not found');
    }

    return await ResumeRepository.updateEducation(educationId, updateData);
  }

  /**
   * Delete education record
   * @param {string} resumeId - Resume ID
   * @param {number} educationId - Education ID
   * @param {string} userId - User ID
   */
  static async deleteEducation(resumeId, userId, educationId) {
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    const education = await ResumeRepository.findEducationById(educationId);
    if (!education || education.resume_id !== resumeId) {
      throw new NotFoundError('Education not found');
    }

    await ResumeRepository.deleteEducation(educationId);
  }

  // ==========================================
  // Experience Operations
  // ==========================================

  /**
   * Add experience to resume
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID
   * @param {Object} experienceData - Experience data
   * @returns {Object} Created experience record
   */
  static async addExperience(resumeId, userId, experienceData) {
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    return await ResumeRepository.addSingleExperience(resumeId, experienceData);
  }

  /**
   * Update experience record
   * @param {string} resumeId - Resume ID
   * @param {number} experienceId - Experience ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated experience record
   */
  static async updateExperience(resumeId, userId, experienceId, updateData) {
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    const experience = await ResumeRepository.findExperienceById(experienceId);
    if (!experience || experience.resume_id !== resumeId) {
      throw new NotFoundError('Experience not found');
    }

    return await ResumeRepository.updateExperience(experienceId, updateData);
  }

  /**
   * Delete experience record
   * @param {string} resumeId - Resume ID
   * @param {number} experienceId - Experience ID
   * @param {string} userId - User ID
   */
  static async deleteExperience(resumeId, userId, experienceId) {
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    const experience = await ResumeRepository.findExperienceById(experienceId);
    if (!experience || experience.resume_id !== resumeId) {
      throw new NotFoundError('Experience not found');
    }

    await ResumeRepository.deleteExperience(experienceId);
  }

  // ==========================================
  // Skills Operations
  // ==========================================

  /**
   * Add skills to resume
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User ID
   * @param {Array} skills - Array of skill objects
   * @returns {Object} Success message
   */
  static async addSkills(resumeId, userId, skills) {
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    await ResumeRepository.addSkills(resumeId, skills);
    return { message: 'Skills added successfully' };
  }

  /**
   * Remove skill from resume
   * @param {string} resumeId - Resume ID
   * @param {number} skillId - Skill ID
   * @param {string} userId - User ID
   */
  static async removeSkill(resumeId, userId, skillId) {
    const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
    if (!isOwner) {
      throw new ForbiddenError('Not authorized to modify this resume');
    }

    await ResumeRepository.deleteSkill(resumeId, skillId);
  }
}

module.exports = ResumeService;
