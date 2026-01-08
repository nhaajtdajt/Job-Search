const ApplicationRepository = require('../repositories/application.repo');
const JobRepository = require('../repositories/job.repo');
const ResumeRepository = require('../repositories/resume.repo');
const EmployerRepository = require('../repositories/employer.repo');
const UserRepository = require('../repositories/user.repo');
const NotificationService = require('./notification.service');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors');
const EmailService = require('./email.service');
const { getUserEmailById } = require('../utils/supabase.util');

/**
 * Application Service
 * Business logic for job applications
 */
class ApplicationService {
  /**
   * Submit a job application
   * @param {string} userId - User ID from authenticated user
   * @param {Object} applicationData - { job_id, resume_id }
   * @returns {Object} Created application
   */
  static async applyJob(userId, applicationData) {
    const { job_id, resume_id } = applicationData;

    // Validate required fields
    if (!job_id || !resume_id) {
      throw new BadRequestError('Job ID and Resume ID are required');
    }

    // Check if job exists
    const job = await JobRepository.findById(job_id);
    if (!job) {
      throw new NotFoundError(`Job with ID ${job_id} not found`);
    }

    // Check if job is still active (not expired)
    if (job.expired_at && new Date(job.expired_at) < new Date()) {
      throw new BadRequestError('This job posting has expired');
    }

    // Check if resume exists and belongs to user
    const resume = await ResumeRepository.findById(resume_id);
    if (!resume) {
      throw new NotFoundError(`Resume with ID ${resume_id} not found`);
    }

    if (resume.user_id !== userId) {
      throw new ForbiddenError('You can only use your own resume');
    }

    // Prevent duplicate applications
    const hasApplied = await ApplicationRepository.hasApplied(userId, job_id);
    if (hasApplied) {
      throw new BadRequestError('You have already applied to this job');
    }

    // Create application
    const applicationToCreate = {
      user_id: userId,
      job_id: job_id,
      resume_id: resume_id,
      status: 'pending',  // Initial status
      apply_date: new Date(),
      notes: null
    };

    const application = await ApplicationRepository.create(applicationToCreate);

    // Get applicant info for notification
    const applicant = await UserRepository.findById(userId);

    // Create notification for employer (async, don't block response)
    this.notifyEmployerNewApplication(job, applicant, application).catch(() => {
      // Silently handle notification errors
    });

    // Send email notifications (async, don't block response)
    this.sendApplicationEmails(userId, job, resume).catch(() => {
      // Silently handle email errors
    });

    return application;
  }

  /**
   * Check if user has applied to a job
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Promise<boolean>}
   */
  static async checkApplication(userId, jobId) {
    return await ApplicationRepository.hasApplied(userId, jobId);
  }

  /**
   * Get user's application history with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Object} Paginated applications
   */
  static async getUserApplications(userId, page = 1, limit = 10, filters = {}) {
    const result = await ApplicationRepository.findByUserId(userId, page, limit, filters);
    return result;
  }

  /**
   * Get application detail
   * @param {number} applicationId - Application ID
   * @param {string} userId - User ID (for ownership check)
   * @returns {Object} Application detail
   */
  static async getApplicationById(applicationId, userId) {
    const application = await ApplicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    // Check if user owns this application
    if (application.user_id !== userId) {
      throw new ForbiddenError('You can only view your own applications');
    }

    return application;
  }

  /**
   * Update application (job seeker can update before employer reviews)
   * @param {number} applicationId - Application ID
   * @param {string} userId - User ID (for ownership check)
   * @param {Object} updateData - Data to update (only resume_id allowed)
   * @returns {Object} Updated application
   */
  static async updateApplication(applicationId, userId, updateData) {
    const application = await ApplicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    // Check ownership
    if (application.user_id !== userId) {
      throw new ForbiddenError('You can only update your own applications');
    }

    // Can only update if status is 'pending'
    if (application.status !== 'pending') {
      throw new BadRequestError(
        `Cannot update application with status: ${application.status}. Only pending applications can be updated.`
      );
    }

    // Only allow updating resume_id
    const allowedUpdates = {};
    if (updateData.resume_id) {
      // Validate new resume exists and belongs to user
      const resume = await ResumeRepository.findById(updateData.resume_id);
      if (!resume) {
        throw new NotFoundError(`Resume with ID ${updateData.resume_id} not found`);
      }
      if (resume.user_id !== userId) {
        throw new ForbiddenError('You can only use your own resume');
      }
      allowedUpdates.resume_id = updateData.resume_id;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      throw new BadRequestError('No valid fields to update');
    }

    const updatedApplication = await ApplicationRepository.update(applicationId, allowedUpdates);
    return updatedApplication;
  }

  /**
   * Withdraw application (delete)
   * @param {number} applicationId - Application ID
   * @param {string} userId - User ID (for ownership check)
   * @returns {Object} Success message
   */
  static async withdrawApplication(applicationId, userId) {
    const application = await ApplicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    // Check ownership
    if (application.user_id !== userId) {
      throw new ForbiddenError('You can only withdraw your own applications');
    }

    // Can only withdraw if status is 'pending' or 'reviewing'
    if (!['pending', 'reviewing'].includes(application.status)) {
      throw new BadRequestError(
        `Cannot withdraw application with status: ${application.status}`
      );
    }

    await ApplicationRepository.delete(applicationId);

    return { message: 'Application withdrawn successfully' };
  }

  /**
   * Get application statistics for user
   * @param {string} userId - User ID
   * @returns {Object} Statistics
   */
  static async getApplicationStatistics(userId) {
    const stats = await ApplicationRepository.getStatistics(userId);
    return stats;
  }

  /**
   * Get applications for a specific job (employer only)
   * @param {number} jobId - Job ID
   * @param {number} employerId - Employer ID (for ownership check)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Object} Paginated applications
   */
  static async getJobApplications(jobId, employerId, page = 1, limit = 10, filters = {}) {
    // Check if job exists
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    // Check if employer owns this job
    const isOwner = await JobRepository.isOwnedByEmployer(jobId, employerId);
    if (!isOwner) {
      throw new ForbiddenError('You can only view applications for your own jobs');
    }

    const result = await ApplicationRepository.findByJobId(jobId, page, limit, filters);
    return result;
  }

  /**
   * Get all applications for employer's jobs
   * @param {number} employerId - Employer ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters
   * @returns {Object} Paginated applications
   */
  static async getEmployerApplications(employerId, page = 1, limit = 10, filters = {}) {
    // Verify employer exists
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError(`Employer with ID ${employerId} not found`);
    }

    const result = await ApplicationRepository.findByEmployerId(employerId, page, limit, filters);
    return result;
  }

  /**
   * Get application detail for employer
   * @param {number} applicationId - Application ID
   * @param {number} employerId - Employer ID (for permission check)
   * @returns {Object} Application detail with user and job info
   */
  static async getApplicationByIdForEmployer(applicationId, employerId) {
    const application = await ApplicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    // Check if employer owns the job this application is for
    const job = await JobRepository.findById(application.job_id);
    if (!job) {
      throw new NotFoundError('Associated job not found');
    }

    if (job.employer_id !== employerId) {
      throw new ForbiddenError('You can only view applications for your own jobs');
    }

    return application;
  }

  /**
   * Update application status (employer only)
   * @param {number} applicationId - Application ID
   * @param {number} employerId - Employer ID (for permission check)
   * @param {string} status - New status
   * @returns {Object} Updated application
   */
  static async updateApplicationStatus(applicationId, employerId, status) {
    // Validate status - include all statuses used in frontend
    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn', 'accepted'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    // Check if employer owns the job this application is for
    const job = await JobRepository.findById(application.job_id);
    if (!job) {
      throw new NotFoundError('Associated job not found');
    }

    if (job.employer_id !== employerId) {
      throw new ForbiddenError('You can only update applications for your own jobs');
    }

    // Validate status transition
    const currentStatus = application.status;
    const invalidTransitions = {
      'accepted': ['pending', 'reviewing'],
      'rejected': ['accepted']
    };

    if (invalidTransitions[currentStatus]?.includes(status)) {
      throw new BadRequestError(
        `Cannot change status from '${currentStatus}' to '${status}'`
      );
    }

    const updatedApplication = await ApplicationRepository.updateStatus(applicationId, status);

    // Send status update email to user (async, don't block response)
    this.sendStatusUpdateEmail(application.user_id, job, currentStatus, status).catch(() => {
      // Silently handle email errors
    });

    // Send in-app notification to user (async, don't block response)
    this.notifyApplicantStatusChange(application.user_id, job, currentStatus, status, applicationId).catch(() => {
      // Silently handle notification errors
    });

    return updatedApplication;
  }

  /**
   * Bulk update application status (employer only)
   * @param {Array} applicationIds - Array of Application IDs
   * @param {number} employerId - Employer ID (for permission check)
   * @param {string} status - New status
   * @returns {Object} Result with updated count
   */
  static async bulkUpdateStatus(applicationIds, employerId, status) {
    // Validate status
    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'interview', 'offer', 'hired', 'rejected', 'withdrawn', 'accepted'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    let updated = 0;
    let failed = 0;
    const errors = [];

    for (const applicationId of applicationIds) {
      try {
        const application = await ApplicationRepository.findById(applicationId);
        if (!application) {
          failed++;
          errors.push({ id: applicationId, error: 'Application not found' });
          continue;
        }

        // Check if employer owns the job this application is for
        const job = await JobRepository.findById(application.job_id);
        if (!job) {
          failed++;
          errors.push({ id: applicationId, error: 'Associated job not found' });
          continue;
        }

        if (job.employer_id !== employerId) {
          failed++;
          errors.push({ id: applicationId, error: 'Permission denied' });
          continue;
        }

        // Update status
        await ApplicationRepository.updateStatus(applicationId, status);
        updated++;

        // Send status update email (async, don't block)
        this.sendStatusUpdateEmail(application.user_id, job, application.status, status).catch(() => {
          // Silently handle email errors
        });

        // Send in-app notification (async, don't block)
        this.notifyApplicantStatusChange(application.user_id, job, application.status, status, applicationId).catch(() => {
          // Silently handle notification errors
        });

      } catch (error) {
        failed++;
        errors.push({ id: applicationId, error: error.message });
      }
    }

    return {
      updated,
      failed,
      total: applicationIds.length,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  /**
   * Get notes for an application (employer only)
   * @param {number} applicationId - Application ID
   * @param {number} employerId - Employer ID (for permission check)
   * @returns {Array} Notes array (currently just the notes field as array)
   */
  static async getApplicationNotes(applicationId, employerId) {
    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    // Check if employer owns the job
    const job = await JobRepository.findById(application.job_id);
    if (!job) {
      throw new NotFoundError('Associated job not found');
    }

    if (job.employer_id !== employerId) {
      throw new ForbiddenError('You can only view notes for applications to your own jobs');
    }

    // Return notes as array format for frontend
    // Currently notes is a single string field, convert to array format
    if (!application.notes) {
      return [];
    }
    
    return [{
      id: applicationId,
      content: application.notes,
      created_at: application.updated_at,
      created_by: 'Nhà tuyển dụng'
    }];
  }

  /**
   * Add notes to an application (employer only)
   * @param {number} applicationId - Application ID
   * @param {number} employerId - Employer ID (for permission check)
   * @param {string} notes - Notes to add
   * @returns {Object} Updated application
   */
  static async addApplicationNotes(applicationId, employerId, notes) {
    if (!notes || notes.trim() === '') {
      throw new BadRequestError('Notes cannot be empty');
    }

    const application = await ApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError(`Application with ID ${applicationId} not found`);
    }

    // Check if employer owns the job
    const job = await JobRepository.findById(application.job_id);
    if (!job) {
      throw new NotFoundError('Associated job not found');
    }

    if (job.employer_id !== employerId) {
      throw new ForbiddenError('You can only add notes to applications for your own jobs');
    }

    const updatedApplication = await ApplicationRepository.addNotes(applicationId, notes);
    return updatedApplication;
  }

  // ==========================================
  // Private Helper Methods for Email
  // ==========================================

  /**
   * Send application confirmation emails
   * @private
   * @param {string} userId - User ID
   * @param {Object} job - Job object with employer info
   * @param {Object} resume - Resume object
   */
  static async sendApplicationEmails(userId, job, resume) {
    // Get user info
    const user = await UserRepository.findById(userId);
    const userEmail = await getUserEmailById(userId);

    if (!userEmail) {
      return;
    }

    // Get company name
    const companyName = job.employer?.company?.company_name || 'Công ty';

    // 1. Send confirmation to job seeker
    await EmailService.sendApplicationReceivedEmail(userEmail, {
      userName: user?.name || 'Ứng viên',
      jobTitle: job.job_title,
      companyName: companyName,
      applyDate: new Date().toLocaleDateString('vi-VN')
    });

    // 2. Send notification to employer
    if (job.employer?.email) {
      await EmailService.sendNewApplicationEmail(job.employer.email, {
        employerName: job.employer.full_name || 'Nhà tuyển dụng',
        applicantName: user?.name || 'Ứng viên',
        jobTitle: job.job_title,
        resumeTitle: resume?.resume_title || 'CV',
        applyDate: new Date().toLocaleDateString('vi-VN')
      });
    }
  }

  /**
   * Send status update email to user
   * @private
   * @param {string} userId - User ID
   * @param {Object} job - Job object
   * @param {string} oldStatus - Previous status
   * @param {string} newStatus - New status
   */
  static async sendStatusUpdateEmail(userId, job, oldStatus, newStatus) {
    // Get user info
    const user = await UserRepository.findById(userId);
    const userEmail = await getUserEmailById(userId);

    if (!userEmail) {
      return;
    }

    // Get company name
    const companyName = job.employer?.company?.company_name || 'Công ty';

    await EmailService.sendStatusUpdateEmail(userEmail, {
      userName: user?.name || 'Ứng viên',
      jobTitle: job.job_title,
      companyName: companyName,
      oldStatus: oldStatus,
      newStatus: newStatus
    });
  }

  /**
   * Create notification for employer when new application is received
   * @private
   * @param {Object} job - Job object with employer info
   * @param {Object} applicant - User object of applicant
   * @param {Object} application - Application object with application_id
   */
  static async notifyEmployerNewApplication(job, applicant, application) {
    try {
      // Get employer to find their user_id
      const employer = await EmployerRepository.findById(job.employer_id);
      
      if (!employer || !employer.user_id) {
        return;
      }

      const applicantName = applicant?.name || 'Ứng viên';
      const jobTitle = job.job_title || 'vị trí tuyển dụng';

      // Create notification with metadata for deep linking
      await NotificationService.createNotification(
        employer.user_id,
        'Ứng viên mới',
        `${applicantName} đã ứng tuyển vào vị trí "${jobTitle}". Xem hồ sơ ngay!`,
        {
          type: 'new_application',
          application_id: application?.application_id,
          job_id: job.job_id,
          applicant_id: applicant?.user_id
        }
      );
    } catch (error) {
      // Don't throw - notifications are not critical
    }
  }

  /**
   * Create notification for job seeker when application status changes
   * @private
   * @param {string} userId - User ID of the applicant
   * @param {Object} job - Job object
   * @param {string} oldStatus - Previous status
   * @param {string} newStatus - New status
   * @param {number} applicationId - Application ID for deep linking
   */
  static async notifyApplicantStatusChange(userId, job, oldStatus, newStatus, applicationId) {
    try {
      const jobTitle = job.job_title || 'vị trí tuyển dụng';
      const companyName = job.employer?.company?.company_name || 'Công ty';

      // Status-specific messages
      const statusMessages = {
        'reviewing': `Hồ sơ ứng tuyển "${jobTitle}" tại ${companyName} đang được xem xét.`,
        'shortlisted': `🎉 Chúc mừng! Bạn đã lọt vào danh sách ngắn cho vị trí "${jobTitle}" tại ${companyName}.`,
        'interview': `📅 Bạn được mời phỏng vấn cho vị trí "${jobTitle}" tại ${companyName}. Vui lòng kiểm tra email!`,
        'offer': `🎊 Tin tuyệt vời! ${companyName} đã gửi cho bạn đề nghị làm việc cho vị trí "${jobTitle}".`,
        'hired': `✅ Chúc mừng bạn đã được nhận vào làm việc tại ${companyName} cho vị trí "${jobTitle}"!`,
        'accepted': `✅ Đơn ứng tuyển của bạn cho vị trí "${jobTitle}" tại ${companyName} đã được chấp nhận.`,
        'rejected': `Rất tiếc, đơn ứng tuyển của bạn cho vị trí "${jobTitle}" tại ${companyName} không được chấp nhận.`,
        'withdrawn': `Đơn ứng tuyển của bạn cho vị trí "${jobTitle}" tại ${companyName} đã được rút lại.`
      };

      // Status-specific titles
      const statusTitles = {
        'reviewing': 'Đang xem xét hồ sơ',
        'shortlisted': 'Vào danh sách ngắn',
        'interview': 'Mời phỏng vấn',
        'offer': 'Đề nghị làm việc',
        'hired': 'Được nhận làm việc',
        'accepted': 'Đơn được chấp nhận',
        'rejected': 'Đơn không được chấp nhận',
        'withdrawn': 'Đơn đã rút lại'
      };

      const title = statusTitles[newStatus] || 'Cập nhật trạng thái đơn ứng tuyển';
      const message = statusMessages[newStatus] || 
        `Trạng thái đơn ứng tuyển của bạn cho vị trí "${jobTitle}" đã được cập nhật thành "${newStatus}".`;

      await NotificationService.createNotification(
        userId,
        title,
        message,
        {
          type: 'application_status_change',
          application_id: applicationId,
          job_id: job.job_id,
          old_status: oldStatus,
          new_status: newStatus
        }
      );
    } catch (error) {
      // Don't throw - notifications are not critical
    }
  }
}


module.exports = ApplicationService;

