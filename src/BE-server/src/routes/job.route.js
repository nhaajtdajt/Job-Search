const express = require("express");
const router = express.Router();
const JobController = require("../controllers/job.controller");

// GET /api/jobs - Get jobs list with pagination
router.get("/", JobController.getJobs);

// GET /api/jobs/:jobId - Get job detail by ID
router.get("/:jobId", JobController.getJobById);

module.exports = router;
