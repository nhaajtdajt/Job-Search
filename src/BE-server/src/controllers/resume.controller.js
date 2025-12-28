const StorageService = require('../services/storage.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');

/**
 * Resume Controller
 * Handle resume/CV operations including upload and download
 */
class ResumeController {
  /**
   * Upload resume PDF
   * POST /api/resumes/:resumeId/upload
   */
  static async uploadCV(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError('No CV file provided');
      }

      const { resumeId } = req.params;
      const userId = req.user.user_id;

      // TODO: Check if resume exists and belongs to user
      // const resume = await ResumeRepository.findById(resumeId);
      // if (!resume) {
      //   throw new NotFoundError('Resume not found');
      // }
      // if (resume.user_id !== userId) {
      //   throw new ForbiddenError('Not authorized to update this resume');
      // }

      // TODO: Delete old CV if exists
      // if (resume.resume_url) {
      //   await StorageService.deleteOldFile(resume.resume_url);
      // }

      // Upload new CV
      const result = await StorageService.uploadResumePDF(
        req.file.buffer,
        userId,
        resumeId
      );

      // TODO: Update database
      // await ResumeRepository.update(resumeId, {
      //   resume_url: result.url,
      //   updated_at: new Date()
      // });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'CV uploaded successfully',
        data: {
          resume_url: result.url,
          path: result.path,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Download resume PDF
   * GET /api/resumes/:resumeId/download
   */
  static async downloadCV(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;
      const employerId = req.user.employer_id;

      // TODO: Get resume from database
      // const resume = await ResumeRepository.findById(resumeId);
      // if (!resume) {
      //   throw new NotFoundError('Resume not found');
      // }

      // TODO: Check permission
      // User can download their own resume
      // Employer can download resume if they have an application
      // const canAccess = resume.user_id === userId || 
      //   await ApplicationRepository.canEmployerAccessResume(employerId, resumeId);
      
      // if (!canAccess) {
      //   throw new ForbiddenError('Not authorized to download this CV');
      // }

      // TODO: Get resume URL from database
      // For now, using dummy path
      const resumeUrl = 'resumes/dummy/file.pdf';

      // Download file
      const fileBuffer = await StorageService.downloadFile(resumeUrl);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="resume_${resumeId}.pdf"`
      );
      res.setHeader('Content-Length', fileBuffer.length);

      return res.send(fileBuffer);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete resume CV
   * DELETE /api/resumes/:resumeId/cv
   */
  static async deleteCV(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;

      // TODO: Check ownership
      // TODO: Get resume URL and delete
      // TODO: Update database (set resume_url to null)

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'CV deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get all resumes for user
   * GET /api/resumes
   */
  static async getAll(req, res, next) {
    try {
      const userId = req.user.user_id;

      // TODO: Implement with ResumeRepository
      // const resumes = await ResumeRepository.findByUserId(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Resumes retrieved successfully',
        data: {
          message: 'Resume repository not yet implemented',
          user_id: userId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get resume by ID
   * GET /api/resumes/:resumeId
   */
  static async getById(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;

      // TODO: Implement

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Resume retrieved successfully',
        data: {
          resume_id: resumeId,
          message: 'Resume repository not yet implemented',
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create new resume
   * POST /api/resumes
   */
  static async create(req, res, next) {
    try {
      const userId = req.user.user_id;
      const resumeData = req.body;

      // TODO: Validate and create resume

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Resume created successfully',
        data: {
          message: 'Resume repository not yet implemented',
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update resume
   * PUT /api/resumes/:resumeId
   */
  static async update(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;
      const updateData = req.body;

      // TODO: Check ownership and update

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Resume updated successfully',
        data: {
          message: 'Resume repository not yet implemented',
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete resume
   * DELETE /api/resumes/:resumeId
   */
  static async delete(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;

      // TODO: Check ownership, delete CV file, delete resume record

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Resume deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ResumeController;
