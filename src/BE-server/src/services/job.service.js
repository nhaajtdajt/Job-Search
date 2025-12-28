const JobRepository = require('../repositories/job.repo');
const { NotFoundError } = require('../errors');

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
}

module.exports = JobService;
