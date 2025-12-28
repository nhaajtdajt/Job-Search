const express = require("express");
const router = express.Router();
const JobController = require("../controllers/job.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

// Public routes
// GET /api/jobs - Get jobs list with pagination
router.get("/", JobController.getJobs);

// GET /api/jobs/my-jobs - Get employer's own jobs (must be before /:jobId)
router.get("/my-jobs",
  authenticate,
  authorize(['employer']),
  JobController.getEmployerJobs
);

// GET /api/jobs/:jobId - Get job detail by ID
router.get("/:jobId", JobController.getJobById);

// PUT /api/jobs/:jobId/views - Increment view counter (public, no auth needed)
router.put("/:jobId/views", JobController.incrementViews);

// Protected routes (employer only)
// POST /api/jobs - Create new job
router.post("/", 
  authenticate, 
  authorize(['employer']), 
  JobController.createJob
);

// PUT /api/jobs/:jobId - Update job
router.put("/:jobId", 
  authenticate, 
  authorize(['employer']), 
  JobController.updateJob
);

// DELETE /api/jobs/:jobId - Delete job
router.delete("/:jobId", 
  authenticate, 
  authorize(['employer']), 
  JobController.deleteJob
);

// POST /api/jobs/:jobId/publish - Publish job
router.post("/:jobId/publish", 
  authenticate, 
  authorize(['employer']), 
  JobController.publishJob
);

// POST /api/jobs/:jobId/expire - Expire/close job
router.post("/:jobId/expire", 
  authenticate, 
  authorize(['employer']), 
  JobController.expireJob
);

module.exports = router;
