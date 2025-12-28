const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * Resume Repository
 * Data access layer for Resume table
 */
class ResumeRepository {
  /**
   * Find all resumes by user ID
   * @param {string} userId - User UUID
   * @returns {Array} Resumes
   */
  static async findByUserId(userId) {
    return await db(MODULE.RESUME)
      .select('*')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
  }

  /**
   * Find resume by ID
   * @param {string} resumeId - Resume ID
   * @returns {Object|null} Resume object or null
   */
  static async findById(resumeId) {
    const resume = await db(MODULE.RESUME)
      .select('*')
      .where('resume_id', resumeId)
      .first();
    
    if (!resume) return null;

    // Get education
    resume.education = await db(MODULE.RES_EDUCATION)
      .select('*')
      .where('resume_id', resumeId);

    // Get experience
    resume.experience = await db(MODULE.RES_EXPERIENCE)
      .select('*')
      .where('resume_id', resumeId);

    // Get skills
    resume.skills = await db(MODULE.RESUME_SKILL)
      .select('*')
      .where('resume_id', resumeId);

    return resume;
  }

  /**
   * Create resume
   * @param {Object} resumeData - Resume data
   * @returns {Object} Created resume
   */
  static async create(resumeData) {
    const [resume] = await db(MODULE.RESUME)
      .insert(resumeData)
      .returning('*');
    
    return resume;
  }

  /**
   * Update resume
   * @param {string} resumeId - Resume ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated resume
   */
  static async update(resumeId, updateData) {
    // Filter allowed fields
    const allowedFields = [
      'resume_title',
      'summary',
      'resume_url'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const [resume] = await db(MODULE.RESUME)
      .where('resume_id', resumeId)
      .update(filteredData)
      .returning('*');
    
    return resume;
  }

  /**
   * Delete resume
   * @param {string} resumeId - Resume ID
   * @returns {number} Number of deleted rows
   */
  static async delete(resumeId) {
    // Delete related data first
    await db(MODULE.RES_EDUCATION).where('resume_id', resumeId).del();
    await db(MODULE.RES_EXPERIENCE).where('resume_id', resumeId).del();
    await db(MODULE.RESUME_SKILL).where('resume_id', resumeId).del();

    return await db(MODULE.RESUME)
      .where('resume_id', resumeId)
      .del();
  }

  /**
   * Check if resume belongs to user
   * @param {string} resumeId - Resume ID
   * @param {string} userId - User UUID
   * @returns {boolean}
   */
  static async isOwnedByUser(resumeId, userId) {
    const resume = await db(MODULE.RESUME)
      .select('resume_id')
      .where({ resume_id: resumeId, user_id: userId })
      .first();
    
    return !!resume;
  }

  /**
   * Add education to resume
   * @param {string} resumeId - Resume ID
   * @param {Array} educationData - Education data array
   */
  static async addEducation(resumeId, educationData) {
    if (!educationData || educationData.length === 0) return;

    const records = educationData.map(edu => ({
      resume_id: resumeId,
      ...edu
    }));

    await db(MODULE.RES_EDUCATION).insert(records);
  }

  /**
   * Add experience to resume
   * @param {string} resumeId - Resume ID
   * @param {Array} experienceData - Experience data array
   */
  static async addExperience(resumeId, experienceData) {
    if (!experienceData || experienceData.length === 0) return;

    const records = experienceData.map(exp => ({
      resume_id: resumeId,
      ...exp
    }));

    await db(MODULE.RES_EXPERIENCE).insert(records);
  }

  /**
   * Add skills to resume
   * @param {string} resumeId - Resume ID
   * @param {Array} skillsData - Skills data array
   */
  static async addSkills(resumeId, skillsData) {
    if (!skillsData || skillsData.length === 0) return;

    const records = skillsData.map(skill => ({
      resume_id: resumeId,
      ...skill
    }));

    await db(MODULE.RESUME_SKILL).insert(records);
  }
}

module.exports = ResumeRepository;
