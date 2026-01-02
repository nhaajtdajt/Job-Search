const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Saved Candidate Repository
 * Data access layer for Saved Candidate table
 */
class SavedCandidateRepository {
  /**
   * Save a candidate for an employer
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @param {string} notes - Optional notes
   * @returns {Object} Saved candidate record
   */
  static async save(employerId, userId, notes = null) {
    const [savedCandidate] = await db(MODULE.SAVED_CANDIDATE)
      .insert({
        employer_id: employerId,
        user_id: userId,
        notes: notes,
        saved_at: new Date()
      })
      .onConflict(['employer_id', 'user_id'])
      .merge({ 
        notes: notes,
        saved_at: new Date() 
      })
      .returning('*');
    
    return savedCandidate;
  }

  /**
   * Unsave a candidate for an employer
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @returns {number} Number of deleted rows
   */
  static async unsave(employerId, userId) {
    return await db(MODULE.SAVED_CANDIDATE)
      .where({
        employer_id: employerId,
        user_id: userId
      })
      .del();
  }

  /**
   * Check if a candidate is saved by employer
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @returns {boolean} True if saved
   */
  static async isSaved(employerId, userId) {
    const saved = await db(MODULE.SAVED_CANDIDATE)
      .where({
        employer_id: employerId,
        user_id: userId
      })
      .first();
    
    return !!saved;
  }

  /**
   * Get all saved candidates for an employer with pagination and search
   * @param {number} employerId - Employer ID
   * @param {Object} options - Query options
   * @returns {Object} Paginated saved candidates
   */
  static async findByEmployerId(employerId, options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      sortBy = 'saved_at',
      sortOrder = 'desc'
    } = options;
    
    const { offset } = parsePagination(page, limit);

    // Base query
    let baseQuery = db(MODULE.SAVED_CANDIDATE)
      .where('saved_candidate.employer_id', employerId)
      .leftJoin('users', 'saved_candidate.user_id', 'users.user_id');

    // Apply search filter
    if (search) {
      baseQuery = baseQuery.where(function() {
        this.whereILike('users.name', `%${search}%`)
          .orWhereRaw('users.user_id::text ILIKE ?', [`%${search}%`]);
      });
    }

    // Count total
    const [{ total }] = await baseQuery.clone().count('* as total');

    // Get paginated results
    const savedCandidates = await baseQuery.clone()
      .select(
        'saved_candidate.*',
        'users.name',
        'users.phone',
        'users.address',
        'users.avatar_url',
        'users.gender'
      )
      .orderBy(sortBy === 'name' ? 'users.name' : `saved_candidate.${sortBy}`, sortOrder)
      .limit(limit)
      .offset(offset);

    // Enrich with resume and application info
    for (const candidate of savedCandidates) {
      // Get latest resume
      const resume = await db(MODULE.RESUME)
        .where('user_id', candidate.user_id)
        .orderBy('updated_at', 'desc')
        .first();
      
      candidate.resume = resume || null;

      // Get application count with this employer
      const [{ count: applicationCount }] = await db(MODULE.APPLICATION)
        .where('user_id', candidate.user_id)
        .join('job', 'application.job_id', 'job.job_id')
        .where('job.employer_id', employerId)
        .count('* as count');
      
      candidate.application_count = parseInt(applicationCount, 10);

      // Get user email from auth (via users table join with application)
      const userWithEmail = await db(MODULE.APPLICATION)
        .select('application.user_id')
        .where('application.user_id', candidate.user_id)
        .first();
      
      // Get email from any application or use a placeholder
      const applicationWithEmail = await db(MODULE.APPLICATION)
        .join('resume', 'application.resume_id', 'resume.resume_id')
        .where('application.user_id', candidate.user_id)
        .first();
      
      // Note: Email is in auth.users, not public.users
      // For now, we'll get it from resume or set to null
      candidate.email = null;
    }

    return {
      data: savedCandidates,
      total: parseInt(total, 10),
      page,
      limit,
      totalPages: Math.ceil(parseInt(total, 10) / limit)
    };
  }

  /**
   * Count saved candidates for an employer
   * @param {number} employerId - Employer ID
   * @returns {number} Count of saved candidates
   */
  static async countByEmployerId(employerId) {
    const result = await db(MODULE.SAVED_CANDIDATE)
      .where('employer_id', employerId)
      .count('* as count')
      .first();
    
    return parseInt(result.count, 10);
  }

  /**
   * Update notes for a saved candidate
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @param {string} notes - Notes to update
   * @returns {Object} Updated record
   */
  static async updateNotes(employerId, userId, notes) {
    const [updated] = await db(MODULE.SAVED_CANDIDATE)
      .where({
        employer_id: employerId,
        user_id: userId
      })
      .update({ notes })
      .returning('*');
    
    return updated;
  }
}

module.exports = SavedCandidateRepository;
