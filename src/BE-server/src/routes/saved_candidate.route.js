/**
 * Saved Candidate Routes
 * API endpoints for employer saved candidates management
 */

const express = require('express');
const router = express.Router();
const SavedCandidateController = require('../controllers/saved_candidate.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

// GET /api/saved-candidates - Get all saved candidates
router.get('/',
  authenticate,
  authorize(['employer']),
  SavedCandidateController.getSavedCandidates
);

// GET /api/saved-candidates/count - Get count of saved candidates
router.get('/count',
  authenticate,
  authorize(['employer']),
  SavedCandidateController.getCount
);

// GET /api/saved-candidates/:userId/check - Check if candidate is saved
router.get('/:userId/check',
  authenticate,
  authorize(['employer']),
  SavedCandidateController.checkSaved
);

// POST /api/saved-candidates - Save a candidate
router.post('/',
  authenticate,
  authorize(['employer']),
  SavedCandidateController.saveCandidate
);

// PATCH /api/saved-candidates/:userId/notes - Update notes
router.patch('/:userId/notes',
  authenticate,
  authorize(['employer']),
  SavedCandidateController.updateNotes
);

// DELETE /api/saved-candidates/:userId - Unsave a candidate
router.delete('/:userId',
  authenticate,
  authorize(['employer']),
  SavedCandidateController.unsaveCandidate
);

module.exports = router;

