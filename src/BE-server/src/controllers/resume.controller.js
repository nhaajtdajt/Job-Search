const StorageService = require('../services/storage.service');
const ResumeRepository = require('../repositories/resume.repo');
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

      const resumes = await ResumeRepository.findByUserId(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Resumes retrieved successfully',
        data: resumes,
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

      const resume = await ResumeRepository.findById(resumeId);

      if (!resume) {
        throw new NotFoundError('Resume not found');
      }

      // Check ownership
      if (resume.user_id !== userId) {
        throw new ForbiddenError('Not authorized to view this resume');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Resume retrieved successfully',
        data: resume,
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

      // Generate resume ID
      const resumeId = 'RES' + Date.now().toString().slice(-4);

      // Create resume
      const resume = await ResumeRepository.create({
        resume_id: resumeId,
        user_id: userId,
        resume_title: resumeData.resume_title,
        summary: resumeData.summary
      });

      // Add education if provided
      if (resumeData.education && resumeData.education.length > 0) {
        await ResumeRepository.addEducation(resumeId, resumeData.education);
      }

      // Add experience if provided
      if (resumeData.experience && resumeData.experience.length > 0) {
        await ResumeRepository.addExperience(resumeId, resumeData.experience);
      }

      // Add skills if provided
      if (resumeData.skills && resumeData.skills.length > 0) {
        await ResumeRepository.addSkills(resumeId, resumeData.skills);
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Resume created successfully',
        data: resume,
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

      // Check ownership
      const isOwner = await ResumeRepository.isOwnedByUser(resumeId, userId);
      if (!isOwner) {
        throw new ForbiddenError('Not authorized to update this resume');
      }

      const resume = await ResumeRepository.update(resumeId, updateData);

      if (!resume) {
        throw new NotFoundError('Resume not found');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Resume updated successfully',
        data: resume,
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

      // Check ownership
      const resume = await ResumeRepository.findById(resumeId);
      if (!resume) {
        throw new NotFoundError('Resume not found');
      }
      if (resume.user_id !== userId) {
        throw new ForbiddenError('Not authorized to delete this resume');
      }

      // Delete CV file if exists
      if (resume.resume_url) {
        try {
          await StorageService.deleteFile(resume.resume_url);
        } catch (err) {
          console.warn('Failed to delete CV file:', err.message);
        }
      }

      // Delete resume record
      await ResumeRepository.delete(resumeId);

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
