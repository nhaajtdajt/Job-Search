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
}

module.exports = JobRepository;
