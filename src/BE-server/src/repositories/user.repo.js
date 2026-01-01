const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * User Repository
 * Data access layer for User table
 */
class UserRepository {
  /**
   * Find user by ID
   * @param {string} userId - User UUID
   * @returns {Object|null} User object or null
   */
  static async findById(userId) {
    // Use raw SQL to format date_of_birth as YYYY-MM-DD string to avoid timezone issues
    const user = await db(MODULE.USERS)
      .select(
        'user_id',
        'name',
        'gender',
        db.raw("COALESCE(to_char(date_of_birth, 'YYYY-MM-DD'), NULL) as date_of_birth"),
        'phone',
        'address',
        'avatar_url',
        'job_title',
        'current_level',
        'industry',
        'field',
        'experience_years',
        'current_salary',
        'education',
        'nationality',
        'marital_status',
        'country',
        'province',
        'desired_location',
        'desired_salary'
      )
      .where('user_id', userId)
      .first();

    return user || null;
  }

  /**
   * Update user profile
   * @param {string} userId - User UUID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user
   */
  static async update(userId, updateData) {
    // Filter allowed fields
    const allowedFields = [
      'name',
      'phone',
      'address',
      'date_of_birth',
      'gender',
      'avatar_url',
      // Professional information
      'job_title',
      'current_level',
      'industry',
      'field',
      'experience_years',
      'current_salary',
      'education',
      // Personal information
      'nationality',
      'marital_status',
      'country',
      'province',
      // Job preferences
      'desired_location',
      'desired_salary'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    await db(MODULE.USERS)
      .where('user_id', userId)
      .update(filteredData);

    // Fetch updated user with formatted date using raw SQL to avoid timezone issues
    const user = await db(MODULE.USERS)
      .select(
        'user_id',
        'name',
        'gender',
        db.raw("COALESCE(to_char(date_of_birth, 'YYYY-MM-DD'), NULL) as date_of_birth"),
        'phone',
        'address',
        'avatar_url',
        'job_title',
        'current_level',
        'industry',
        'field',
        'experience_years',
        'current_salary',
        'education',
        'nationality',
        'marital_status',
        'country',
        'province',
        'desired_location',
        'desired_salary'
      )
      .where('user_id', userId)
      .first();

    return user || null;
  }

  /**
   * Create user profile
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  static async create(userData) {
    const [user] = await db(MODULE.USERS)
      .insert(userData)
      .returning('*');

    return user;
  }

  /**
   * Delete user
   * @param {string} userId - User UUID
   * @returns {number} Number of deleted rows
   */
  static async delete(userId) {
    return await db(MODULE.USERS)
      .where('user_id', userId)
      .del();
  }

  /**
   * Find all users with pagination and filters (Admin only)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (role, status)
   * @returns {Object} Paginated users
   */
  static async findAll(page = 1, limit = 10, filters = {}) {
    const { parsePagination } = require('../utils/pagination.util');
    const { offset } = parsePagination(page, limit);

    let query = db(MODULE.USERS).select('*');
    
    // Note: role filter would need to be checked from auth.users table
    // For now, we'll just paginate users table
    
    const [{ total }] = await query.clone().count('* as total');
    
    const data = await query
      .orderBy('user_id', 'asc')
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
   * Find users by role
   * @param {string} role - User role (job_seeker, employer)
   * @returns {Array} List of users
   */
  static async findByRole(role) {
    return await db(MODULE.USERS)
      .select('user_id', 'name')
      .where('role', role);
  }

  /**
   * Get candidate profile with resume details (for employer viewing)
   * @param {string} userId - User UUID
   * @returns {Object} Candidate profile with resume info
   */
  static async getCandidateWithResume(userId) {
    const user = await this.findById(userId);
    if (!user) return null;

    // Get latest resume
    const resume = await db(MODULE.RESUME)
      .where('user_id', userId)
      .orderBy('updated_at', 'desc')
      .first();

    // Get resume details if exists
    let experiences = [];
    let educations = [];
    let skills = [];

    if (resume) {
      experiences = await db(MODULE.RES_EXPERIENCE)
        .where('resume_id', resume.resume_id)
        .orderBy('start_date', 'desc');

      educations = await db(MODULE.RES_EDUCATION)
        .where('resume_id', resume.resume_id)
        .orderBy('start_year', 'desc');

      skills = await db(MODULE.RESUME_SKILL)
        .join(MODULE.SKILL, 'resume_skill.skill_id', 'skill.skill_id')
        .where('resume_id', resume.resume_id)
        .select('skill.skill_name as name', 'resume_skill.level');
    }

    return {
      ...user,
      summary: resume?.summary || null,
      title: resume?.resume_title || null,
      resume: resume ? {
        resume_id: resume.resume_id,
        resume_title: resume.resume_title,
        summary: resume.summary,
        resume_url: resume.resume_url,
        experiences,
        educations,
        skills
      } : null
    };
  }

  /**
   * Get candidate's applications for a specific employer
   * @param {string} userId - User UUID
   * @param {number} employerId - Employer ID
   * @returns {Array} Applications list
   */
  static async getCandidateApplicationsForEmployer(userId, employerId) {
    const applications = await db(MODULE.APPLICATION)
      .join(MODULE.JOB, 'application.job_id', 'job.job_id')
      .where('application.user_id', userId)
      .where('job.employer_id', employerId)
      .select(
        'application.application_id',
        'application.status',
        'application.apply_date as applied_at',
        'application.notes',
        'job.job_id',
        'job.job_title'
      )
      .orderBy('application.apply_date', 'desc');

    return applications;
  }
}

module.exports = UserRepository;
