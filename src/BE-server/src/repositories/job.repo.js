const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Job Repository
 * Data access layer for Job table
 */
class JobRepository {
  /**
   * Get jobs with pagination and filters
   */
  static async findAll(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    let query = db(MODULE.JOB).select('*');

    // Apply filters
    if (filters.job_type) {
      query = query.where('job_type', filters.job_type);
    }
    if (filters.employer_id) {
      query = query.where('employer_id', filters.employer_id);
    }

    // Get total count
    const countQuery = db(MODULE.JOB).count('* as total');
    if (filters.job_type) {
      countQuery.where('job_type', filters.job_type);
    }
    if (filters.employer_id) {
      countQuery.where('employer_id', filters.employer_id);
    }

    const [{ total }] = await countQuery;

    // Get paginated data
    const data = await query
      .orderBy('posted_at', 'desc')
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
   * Find job by ID with employer and company info
   */
  static async findById(jobId) {
    const job = await db(MODULE.JOB)
      .select('*')
      .where('job_id', jobId)
      .first();

    if (!job) return null;

    // Get employer info
    const employer = await db(MODULE.EMPLOYER)
      .select('employer_id', 'full_name', 'email', 'role', 'company_id')
      .where('employer_id', job.employer_id)
      .first();

    if (employer) {
      // Get company info
      const company = await db(MODULE.COMPANY)
        .select('company_id', 'company_name', 'website', 'address', 'logo_url')
        .where('company_id', employer.company_id)
        .first();

      employer.company = company || null;
    }

    job.employer = employer || null;

    return job;
  }

  /**
   * Create a new job
   * @param {Object} jobData - Job data to insert
   * @returns {Object} Created job
   */
  static async create(jobData) {
    const [job] = await db(MODULE.JOB)
      .insert(jobData)
      .returning('*');

    return job;
  }

  /**
   * Update job by ID
   * @param {number} jobId - Job ID to update
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated job
   */
  static async update(jobId, updateData) {
    const [job] = await db(MODULE.JOB)
      .where('job_id', jobId)
      .update(updateData)
      .returning('*');

    return job;
  }

  /**
   * Delete job by ID
   * @param {number} jobId - Job ID to delete
   * @returns {number} Number of deleted rows
   */
  static async delete(jobId) {
    return await db(MODULE.JOB)
      .where('job_id', jobId)
      .del();
  }

  /**
   * Increment views counter for a job
   * @param {number} jobId - Job ID
   * @returns {Object} Updated job
   */
  static async incrementViews(jobId) {
    const [job] = await db(MODULE.JOB)
      .where('job_id', jobId)
      .increment('views', 1)
      .returning('*');

    return job;
  }

  /**
   * Check if job exists and belongs to employer
   * @param {number} jobId - Job ID
   * @param {number} employerId - Employer ID
   * @returns {boolean}
   */
  static async isOwnedByEmployer(jobId, employerId) {
    const job = await db(MODULE.JOB)
      .select('job_id')
      .where({ job_id: jobId, employer_id: employerId })
      .first();

    return !!job;
  }

  /**
   * Add tags to a job
   * @param {number} jobId - Job ID
   * @param {Array<number>} tagIds - Array of tag IDs
   */
  static async addTags(jobId, tagIds) {
    if (!tagIds || tagIds.length === 0) return;

    const tagInserts = tagIds.map(tagId => ({
      job_id: jobId,
      tag_id: tagId
    }));

    await db(MODULE.JOB_TAG).insert(tagInserts);
  }

  /**
   * Remove all tags from a job
   * @param {number} jobId - Job ID
   */
  static async removeTags(jobId) {
    await db(MODULE.JOB_TAG)
      .where('job_id', jobId)
      .del();
  }

  /**
   * Add locations to a job
   * @param {number} jobId - Job ID
   * @param {Array<number>} locationIds - Array of location IDs
   */
  static async addLocations(jobId, locationIds) {
    if (!locationIds || locationIds.length === 0) return;

    const locationInserts = locationIds.map(locationId => ({
      job_id: jobId,
      location_id: locationId
    }));

    await db(MODULE.JOB_LOCATION).insert(locationInserts);
  }

  /**
   * Remove all locations from a job
   * @param {number} jobId - Job ID
   */
  static async removeLocations(jobId) {
    await db(MODULE.JOB_LOCATION)
      .where('job_id', jobId)
      .del();
  }

  /**
   * Add skills to a job
   * @param {number} jobId - Job ID
   * @param {Array<string>} skillIds - Array of skill IDs
   */
  static async addSkills(jobId, skillIds) {
    if (!skillIds || skillIds.length === 0) return;

    const skillInserts = skillIds.map(skillId => ({
      job_id: jobId,
      skill_id: skillId
    }));

    await db(MODULE.JOB_SKILL).insert(skillInserts);
  }

  /**
   * Remove all skills from a job
   * @param {number} jobId - Job ID
   */
  static async removeSkills(jobId) {
    await db(MODULE.JOB_SKILL)
      .where('job_id', jobId)
      .del();
  }

  /**
   * Get jobs by employer ID
   * @param {number} employerId - Employer ID
   * @returns {Array} Jobs
   */
  static async findByEmployerId(employerId) {
    return await db(MODULE.JOB)
      .select('*')
      .where('employer_id', employerId)
      .orderBy('posted_at', 'desc');
  }

  /**
   * Get jobs by company ID
   * @param {number} companyId - Company ID
   * @returns {Array} Jobs
   */
  static async findByCompanyId(companyId) {
    // Get all employers for this company
    const employers = await db(MODULE.EMPLOYER)
      .select('employer_id')
      .where('company_id', companyId);
    
    const employerIds = employers.map(e => e.employer_id);
    
    if (employerIds.length === 0) {
      return [];
    }
    
    // Get jobs from these employers
    return await db(MODULE.JOB)
      .select('*')
      .whereIn('employer_id', employerIds)
      .orderBy('posted_at', 'desc');
  }
}

module.exports = JobRepository;
