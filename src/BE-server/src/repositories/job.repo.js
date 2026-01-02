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

    let query = db(MODULE.JOB).select('job.*');

    // Filter by Location Relation
    if (filters.location) {
      query = query.whereExists(function() {
        this.select('*')
          .from(MODULE.JOB_LOCATION)
          .join(MODULE.LOCATION, 'job_location.location_id', 'location.location_id')
          .whereRaw('job_location.job_id = job.job_id')
          .andWhere('location.location_name', 'ilike', `%${filters.location}%`);
      });
    }

    // Apply other filters
    if (filters.search) {
      query = query.where(builder => {
        builder.where('job_title', 'ilike', `%${filters.search}%`)
          .orWhere('description', 'ilike', `%${filters.search}%`);
      });
    }

    if (filters.location) {
      // Handled above via exists
    }

    if (filters.job_type) {
      if (Array.isArray(filters.job_type)) {
        query = query.whereIn('job_type', filters.job_type);
      } else {
        query = query.where('job_type', filters.job_type);
      }
    }

    if (filters.posted_within) {
      const days = parseInt(filters.posted_within, 10);
      if (days > 0) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        query = query.where('posted_at', '>=', date);
      }
    }
    
    if (filters.employer_id) {
      query = query.where('employer_id', filters.employer_id);
    }

    if (filters.is_remote !== undefined) {
      query = query.where('is_remote', filters.is_remote);
    }

    if (filters.experience_level) {
      // If array passed via comma-separated or similar, handle it. 
      // Assuming frontend passes single string or backend controller splits it. 
      // Knex whereIn expects array.
      if (Array.isArray(filters.experience_level)) {
        query = query.whereIn('experience_level', filters.experience_level);
      } else {
        query = query.where('experience_level', filters.experience_level);
      }
    }

    if (filters.salary_min) {
      query = query.where('salary_max', '>=', filters.salary_min);
    }

    if (filters.salary_max) {
      query = query.where('salary_min', '<=', filters.salary_max);
    }

    // Get total count (clone query before sorting/pagination)
    const countQuery = query.clone().clearSelect().count('* as total');
    const [{ total }] = await countQuery;

    // Sort
    if (filters.sort === 'salary_desc') {
      query = query.orderBy('salary_max', 'desc');
    } else if (filters.sort === 'salary_asc') {
      query = query.orderBy('salary_min', 'asc');
    } else if (filters.sort === 'relevance') {
       // Simple relevance: exact matches first if search keyword exists, else just newest
       if (filters.search) {
         query = query.orderByRaw(`
           CASE 
             WHEN job_title ILIKE ? THEN 1 
             ELSE 2 
           END, posted_at DESC
         `, [`%${filters.search}%`]);
       } else {
         query = query.orderBy('posted_at', 'desc');
       }
    } else {
      // Default newest
      query = query.orderBy('posted_at', 'desc');
    }

    // Get paginated data
    const data = await query
      .limit(limit)
      .offset(offset);

    // Fetch location, company, employer info
    const employerIds = [...new Set(data.map(j => j.employer_id))];
    const jobIds = data.map(j => j.job_id);

    const [employers, locations] = await Promise.all([
      db(MODULE.EMPLOYER)
        .select('employer_id', 'company_id')
        .whereIn('employer_id', employerIds),
      
      db(MODULE.JOB_LOCATION)
        .join(MODULE.LOCATION, 'job_location.location_id', 'location.location_id')
        .select('job_location.job_id', 'location.location_name')
        .whereIn('job_location.job_id', jobIds)
    ]);
    
    const companyIds = [...new Set(employers.map(e => e.company_id).filter(id => id))];
    const companies = await db(MODULE.COMPANY)
      .select('company_id', 'company_name', 'logo_url')
      .whereIn('company_id', companyIds);

    const enrichedData = data.map(job => {
      const emp = employers.find(e => e.employer_id == job.employer_id);
      const comp = emp ? companies.find(c => c.company_id == emp.company_id) : null;
      const jobLocs = locations.filter(l => l.job_id == job.job_id).map(l => l.location_name);
      
      return {
        ...job,
        company_name: comp?.company_name,
        company_logo: comp?.logo_url,
        company_id: comp?.company_id,
        location: jobLocs.join(', ') // Provide location string to frontend as it expects
      };
    });

    return {
      data: enrichedData,
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
        .select(
          'company_id', 
          'company_name', 
          'website', 
          'address', 
          'logo_url', 
          'description',
          'industry',
          'company_size',
          'founded_year',
          'email',
          'phone'
        )
        .where('company_id', employer.company_id)
        .first();

      employer.company = company || null;
      
      // Flatten company info for frontend consistency
      if (company) {
        job.company_id = company.company_id;
        job.company_name = company.company_name;
        job.company_logo = company.logo_url;
        job.company_description = company.description;
        job.company_address = company.address;
        job.company_website = company.website;
        job.company_industry = company.industry;
        job.company_size = company.company_size;
        job.company_founded_year = company.founded_year;
        job.company_email = company.email;
        job.company_phone = company.phone;
      }
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
    // Get company details for name
    const company = await db(MODULE.COMPANY)
        .select('company_id', 'company_name')
        .where('company_id', companyId)
        .first();

    if (!company) return [];

    // Get all employers for this company
    const employers = await db(MODULE.EMPLOYER)
      .select('employer_id')
      .where('company_id', companyId);
    
    const employerIds = employers.map(e => e.employer_id);
    
    if (employerIds.length === 0) {
      return [];
    }
    
    // Get jobs from these employers
    const jobs = await db(MODULE.JOB)
      .select('*')
      .whereIn('employer_id', employerIds)
      .orderBy('posted_at', 'desc');

    if (jobs.length === 0) return [];

    // Get locations
    const jobIds = jobs.map(j => j.job_id);
    const locations = await db(MODULE.JOB_LOCATION)
        .join(MODULE.LOCATION, 'job_location.location_id', 'location.location_id')
        .select('job_location.job_id', 'location.location_name')
        .whereIn('job_location.job_id', jobIds);

    // Enrich data
    return jobs.map(job => {
        const jobLocs = locations.filter(l => l.job_id == job.job_id).map(l => l.location_name);
        return {
            ...job,
            company_name: company.company_name,
            company_id: company.company_id,
            location: jobLocs.join(', ')
        };
    });
  }
}

module.exports = JobRepository;
