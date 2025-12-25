const express = require("express");
const router = express.Router();
const JobController = require("../controllers/jobController");

// GET /api/jobs
router.get("/", JobController.getJobs);

// GET /api/jobs/:jobId
router.get("/:jobId", JobController.getJobById);

module.exports = router;
