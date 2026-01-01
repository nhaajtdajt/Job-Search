/**
 * Saved Candidate Controller
 * Handles HTTP requests for saved candidate operations
 */

const SavedCandidateService = require('../services/saved_candidate.service');

class SavedCandidateController {
  /**
   * Save a candidate
   * POST /api/saved-candidates
   */
  static async saveCandidate(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const { userId, notes } = req.body;

      const result = await SavedCandidateService.saveCandidate(employerId, userId, notes);

      res.status(201).json({
        success: true,
        message: 'Candidate saved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unsave a candidate
   * DELETE /api/saved-candidates/:userId
   */
  static async unsaveCandidate(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const { userId } = req.params;

      await SavedCandidateService.unsaveCandidate(employerId, userId);

      res.status(200).json({
        success: true,
        message: 'Candidate unsaved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get saved candidates list
   * GET /api/saved-candidates
   */
  static async getSavedCandidates(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const { page = 1, limit = 10, search, sortBy, sortOrder } = req.query;

      const result = await SavedCandidateService.getSavedCandidates(employerId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
        sortBy,
        sortOrder
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check if candidate is saved
   * GET /api/saved-candidates/:userId/check
   */
  static async checkSaved(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const { userId } = req.params;

      const result = await SavedCandidateService.checkSaved(employerId, userId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update notes for a saved candidate
   * PATCH /api/saved-candidates/:userId/notes
   */
  static async updateNotes(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const { userId } = req.params;
      const { notes } = req.body;

      const result = await SavedCandidateService.updateNotes(employerId, userId, notes);

      res.status(200).json({
        success: true,
        message: 'Notes updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get count of saved candidates
   * GET /api/saved-candidates/count
   */
  static async getCount(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const count = await SavedCandidateService.getCount(employerId);

      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SavedCandidateController;
