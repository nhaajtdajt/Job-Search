const environment = require('../configs/environment.config');
const authRoutes = require('./auth.route');
const jobRoutes = require('./job.route');
const swaggerRoute = require('./swagger.route');

const initRoute = (app) => {
  // Swagger Documentation (public, no auth)
  app.use("/docs", swaggerRoute);

  // Root endpoint
  app.get("/", (req, res) => {
    res.json({
      message: "Job Search API Server",
      version: "1.0.0",
      environment: environment.NODE_ENV,
      endpoints: {
        auth: {
          register: "POST /api/auth/register",
          login: "POST /api/auth/login",
          logout: "POST /api/auth/logout",
          refreshToken: "POST /api/auth/refresh-token",
          forgotPassword: "POST /api/auth/forgot-password",
          resetPassword: "POST /api/auth/reset-password",
          verifyEmail: "POST /api/auth/verify-email",
          resendVerification: "POST /api/auth/resend-verification"
        },
        jobs: {
          list: "GET /api/jobs",
          detail: "GET /api/jobs/:jobId"
        },
        docs: "GET /docs"
      },
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
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
