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

  // ==========================================
  // Education Endpoints
  // ==========================================

  /**
   * Add education to resume
   * POST /api/resumes/:resumeId/education
   */
  static async addEducation(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;
      const educationData = req.body;

      const education = await ResumeService.addEducation(resumeId, userId, educationData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Education added successfully',
        data: education,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update education record
   * PUT /api/resumes/:resumeId/education/:educationId
   */
  static async updateEducation(req, res, next) {
    try {
      const { resumeId, educationId } = req.params;
      const userId = req.user.user_id;
      const updateData = req.body;

      const education = await ResumeService.updateEducation(resumeId, userId, parseInt(educationId), updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Education updated successfully',
        data: education,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete education record
   * DELETE /api/resumes/:resumeId/education/:educationId
   */
  static async deleteEducation(req, res, next) {
    try {
      const { resumeId, educationId } = req.params;
      const userId = req.user.user_id;

      await ResumeService.deleteEducation(resumeId, userId, parseInt(educationId));

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Education deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ==========================================
  // Experience Endpoints
  // ==========================================

  /**
   * Add experience to resume
   * POST /api/resumes/:resumeId/experience
   */
  static async addExperience(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;
      const experienceData = req.body;

      const experience = await ResumeService.addExperience(resumeId, userId, experienceData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Experience added successfully',
        data: experience,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update experience record
   * PUT /api/resumes/:resumeId/experience/:experienceId
   */
  static async updateExperience(req, res, next) {
    try {
      const { resumeId, experienceId } = req.params;
      const userId = req.user.user_id;
      const updateData = req.body;

      const experience = await ResumeService.updateExperience(resumeId, userId, parseInt(experienceId), updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Experience updated successfully',
        data: experience,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete experience record
   * DELETE /api/resumes/:resumeId/experience/:experienceId
   */
  static async deleteExperience(req, res, next) {
    try {
      const { resumeId, experienceId } = req.params;
      const userId = req.user.user_id;

      await ResumeService.deleteExperience(resumeId, userId, parseInt(experienceId));

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Experience deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  // ==========================================
  // Skills Endpoints
  // ==========================================

  /**
   * Add skills to resume
   * POST /api/resumes/:resumeId/skills
   */
  static async addSkills(req, res, next) {
    try {
      const { resumeId } = req.params;
      const userId = req.user.user_id;
      const { skills } = req.body;

      const result = await ResumeService.addSkills(resumeId, userId, skills);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Skills added successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Remove skill from resume
   * DELETE /api/resumes/:resumeId/skills/:skillId
   */
  static async removeSkill(req, res, next) {
    try {
      const { resumeId, skillId } = req.params;
      const userId = req.user.user_id;

      await ResumeService.removeSkill(resumeId, userId, parseInt(skillId));

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Skill removed successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ResumeController;
