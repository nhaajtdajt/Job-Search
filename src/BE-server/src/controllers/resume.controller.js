const ResumeService = require('../services/resume.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError } = require('../errors');
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

      const result = await ResumeService.uploadCV(resumeId, userId, req.file.buffer);

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

      const fileBuffer = await ResumeService.downloadCV(resumeId, userId, employerId);

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

      await ResumeService.deleteCV(resumeId, userId);

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

      const resumes = await ResumeService.getAllByUserId(userId);

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

      const resume = await ResumeService.getById(resumeId, userId);

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

      const resume = await ResumeService.create(userId, resumeData);

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

      const resume = await ResumeService.update(resumeId, userId, updateData);

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

      await ResumeService.delete(resumeId, userId);

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
