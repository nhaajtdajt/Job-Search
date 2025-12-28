const environment = require('../configs/environment.config');
const jobRoutes = require('./job.route');

const initRoute = (app) => {
  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "Job Search API Server",
      version: "1.0.0",
      environment: environment.NODE_ENV,
      endpoints: {
        jobs: "/api/jobs",
        jobDetail: "/api/jobs/:jobId",
      },
    });
  });

  // API Routes
  app.use("/api/jobs", jobRoutes);

  // 404 handler - must be after all routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`
    });
  });
};

module.exports = initRoute;
