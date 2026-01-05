const express = require("express");
const router = express.Router();
const JobController = require("../controllers/job.controller");
const ApplicationController = require("../controllers/application.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");
const RoleMiddleware = require("../middlewares/role.middleware");

// Public routes
// GET /api/jobs/skills - Get all skills with job count
router.get("/skills", JobController.getAllSkills);

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

// Protected routes (employer only - requires verified status)
// POST /api/jobs - Create new job
router.post("/",
  authenticate,
  RoleMiddleware.requireVerifiedEmployer(),
  JobController.createJob
);

// PUT /api/jobs/:jobId - Update job
router.put("/:jobId",
  authenticate,
  RoleMiddleware.requireVerifiedEmployer(),
  JobController.updateJob
);

// DELETE /api/jobs/:jobId - Delete job
router.delete("/:jobId",
  authenticate,
  RoleMiddleware.requireVerifiedEmployer(),
  JobController.deleteJob
);

// POST /api/jobs/:jobId/publish - Publish job
router.post("/:jobId/publish",
  authenticate,
  RoleMiddleware.requireVerifiedEmployer(),
  JobController.publishJob
);

// POST /api/jobs/:jobId/expire - Expire/close job
router.post("/:jobId/expire",
  authenticate,
  RoleMiddleware.requireVerifiedEmployer(),
  JobController.expireJob
);

// GET /api/jobs/:jobId/applications - Get applications for a job (employer only)
router.get("/:jobId/applications",
  authenticate,
  RoleMiddleware.requireVerifiedEmployer(),
  ApplicationController.getJobApplications
);

// GET /api/jobs/:jobId/application-status - Check if user applied (job seeker only)
router.get("/:jobId/application-status",
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.checkApplication
);

// POST /api/jobs/:jobId/apply - Apply for a job (job seeker only)
router.post("/:jobId/apply",
  authenticate,
  authorize(['job_seeker']),
  ApplicationController.applyJobByJobId
);

module.exports = router;
