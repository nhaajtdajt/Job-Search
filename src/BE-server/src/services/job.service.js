const JobRepository = require('../repositories/job.repo');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../errors');
const JobMatchService = require('./job-match.service');

/**
 * Job Service
 * Business logic for Job
 */
class JobService {
  /**
   * Get jobs list with pagination
   */
  static async getJobs(page = 1, limit = 10, filters = {}) {
    const result = await JobRepository.findAll(page, limit, filters);
    return result;
  }

  /**
   * Get job detail by ID
   */
  static async getJobById(jobId) {
    const job = await JobRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    return job;
  }

  /**
   * Create a new job posting
   * @param {number} employerId - Employer ID from authenticated user
   * @param {Object} jobData - Job data
   */
  static async createJob(employerId, jobData) {
    // Validate required fields
    if (!jobData.job_title || !jobData.job_type) {
      throw new BadRequestError('Job title and job type are required');
    }

    // Auto-calculate expired_at if not provided (default: 30 days from now)
    if (!jobData.expired_at) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      jobData.expired_at = expiryDate;
    }

    // Prepare job data
    const jobToCreate = {
      employer_id: employerId,
      job_title: jobData.job_title,
      description: jobData.description,
      requirements: jobData.requirements,
      benefits: jobData.benefits,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      job_type: jobData.job_type,
      expired_at: jobData.expired_at,
      views: 0
    };

    // Create job
    const job = await JobRepository.create(jobToCreate);

    // Add relations if provided
    if (jobData.tag_ids && jobData.tag_ids.length > 0) {
      await JobRepository.addTags(job.job_id, jobData.tag_ids);
    }

    if (jobData.location_ids && jobData.location_ids.length > 0) {
      await JobRepository.addLocations(job.job_id, jobData.location_ids);
    }

    // Check for matching saved searches and notify users (async, don't block response)
    // Pass extra data (tags, skills) for similarity matching
    const jobForMatch = {
      ...job,
      tag_ids: jobData.tag_ids || [],
      skill_ids: jobData.skill_ids || []
    };

    JobMatchService.checkAndNotifyMatches(jobForMatch).catch(err => {
      console.error('Failed to check job matches:', err.message);
    });

    return job;
  }

  /**
   * Update job posting
   * @param {number} jobId - Job ID to update
   * @param {number} employerId - Employer ID from authenticated user
   * @param {Object} updateData - Data to update
   */
  static async updateJob(jobId, employerId, updateData) {
    // Check if job exists
    const existingJob = await JobRepository.findById(jobId);
    if (!existingJob) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    // Check ownership
    const isOwner = await JobRepository.isOwnedByEmployer(jobId, employerId);
    if (!isOwner) {
      throw new ForbiddenError('You do not have permission to update this job');
    }

    // Prepare update data (only allow certain fields)
    const allowedFields = [
      'job_title',
      'description',
      'requirements',
      'benefits',
      'salary_min',
      'salary_max',
      'job_type',
      'expired_at'
    ];

    const jobUpdateData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        jobUpdateData[field] = updateData[field];
      }
    }

    // Update job
    const updatedJob = await JobRepository.update(jobId, jobUpdateData);

    // Update relations if provided
    if (updateData.tag_ids !== undefined) {
      await JobRepository.removeTags(jobId);
      if (updateData.tag_ids.length > 0) {
        await JobRepository.addTags(jobId, updateData.tag_ids);
      }
    }

    if (updateData.location_ids !== undefined) {
      await JobRepository.removeLocations(jobId);
      if (updateData.location_ids.length > 0) {
        await JobRepository.addLocations(jobId, updateData.location_ids);
      }
    }

    if (updateData.skill_ids !== undefined) {
      await JobRepository.removeSkills(jobId);
      if (updateData.skill_ids.length > 0) {
        await JobRepository.addSkills(jobId, updateData.skill_ids);
      }
    }

    return updatedJob;
  }

  /**
   * Delete job posting
   * @param {number} jobId - Job ID to delete
   * @param {number} employerId - Employer ID from authenticated user
   */
  static async deleteJob(jobId, employerId) {
    // Check if job exists
    const existingJob = await JobRepository.findById(jobId);
    if (!existingJob) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    // Check ownership
    const isOwner = await JobRepository.isOwnedByEmployer(jobId, employerId);
    if (!isOwner) {
      throw new ForbiddenError('You do not have permission to delete this job');
    }

    // Delete relationships first (cascading should handle this, but being explicit)
    await JobRepository.removeTags(jobId);
    await JobRepository.removeLocations(jobId);
    await JobRepository.removeSkills(jobId);

    // Delete job
    await JobRepository.delete(jobId);

    return { message: 'Job deleted successfully' };
  }

  /**
   * Publish a job (if it was in draft status)
   * @param {number} jobId - Job ID
   * @param {number} employerId - Employer ID from authenticated user
   */
  static async publishJob(jobId, employerId) {
    // Check if job exists
    const existingJob = await JobRepository.findById(jobId);
    if (!existingJob) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    // Check ownership
    const isOwner = await JobRepository.isOwnedByEmployer(jobId, employerId);
    if (!isOwner) {
      throw new ForbiddenError('You do not have permission to publish this job');
    }

    // Update posted_at to now
    const updatedJob = await JobRepository.update(jobId, {
      posted_at: new Date()
    });

    return updatedJob;
  }

  /**
   * Expire/close a job (close recruitment)
   * @param {number} jobId - Job ID
   * @param {number} employerId - Employer ID from authenticated user
   */
  static async expireJob(jobId, employerId) {
    // Check if job exists
    const existingJob = await JobRepository.findById(jobId);
    if (!existingJob) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    // Check ownership
    const isOwner = await JobRepository.isOwnedByEmployer(jobId, employerId);
    if (!isOwner) {
      throw new ForbiddenError('You do not have permission to expire this job');
    }

    // Set expired_at to now
    const updatedJob = await JobRepository.update(jobId, {
      expired_at: new Date()
    });

    return updatedJob;
  }

  /**
   * Increment view counter for a job
   * @param {number} jobId - Job ID
   */
  static async incrementViews(jobId) {
    // Check if job exists
    const existingJob = await JobRepository.findById(jobId);
    if (!existingJob) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    const updatedJob = await JobRepository.incrementViews(jobId);
    return updatedJob;
  }

  /**
   * Get jobs by employer ID
   * @param {number} employerId - Employer ID
   */
  static async getJobsByEmployer(employerId) {
    const jobs = await JobRepository.findByEmployerId(employerId);
    return jobs;
  }
}

module.exports = JobService;
