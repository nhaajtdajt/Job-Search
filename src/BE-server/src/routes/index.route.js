const environment = require('../configs/environment.config');
const authRoutes = require('./auth.route');
const jobRoutes = require('./job.route');
const swaggerRoute = require('./swagger.route');
const userRoutes = require('./user.route');
const employerRoutes = require('./employer.route');
const companyRoutes = require('./company.route');
const resumeRoutes = require('./resume.route');
const applicationRoutes = require('./application.route');
const searchRoutes = require('./search.route');
const notificationRoutes = require('./notification.route');
const adminRoutes = require('./admin.route');
const savedCandidateRoutes = require('./saved_candidate.route');
const savedJobRoutes = require('./saved_job.route');
const savedSearchRoutes = require('./saved_search.route');
const employerSettingsRoutes = require('./employer-settings.route');
const followedCompanyRoutes = require('./followed_company.route');

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
        users: "/api/users",
        employers: "/api/employers",
        employerSettings: "/api/employer-settings",
        companies: "/api/companies",
        resumes: "/api/resumes",
        applications: "/api/applications",
        savedJobs: "/api/saved-jobs",
        savedSearches: "/api/saved-searches",
        searches: "/api/searches",
        notifications: "/api/notifications",
        admin: "/api/admin",
        savedCandidates: "/api/saved-candidates",
        followedCompanies: "/api/followed-companies",
        docs: "GET /docs"
      },
    });
  });

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/employers", employerRoutes);
  app.use("/api/employer-settings", employerSettingsRoutes);
  app.use("/api/companies", companyRoutes);
  app.use("/api/resumes", resumeRoutes);
  app.use("/api/applications", applicationRoutes);
  app.use("/api/saved-jobs", savedJobRoutes);
  app.use("/api/saved-searches", savedSearchRoutes);
  app.use("/api/searches", searchRoutes);  // Saved searches (protected)
  app.use("/api/search", searchRoutes);    // Search suggestions (public)
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/saved-candidates", savedCandidateRoutes);
  app.use("/api/followed-companies", followedCompanyRoutes);

  // 404 handler - must be after all routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`
    });
  });
};

module.exports = initRoute;


