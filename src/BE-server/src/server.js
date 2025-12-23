const express = require("express");
const cors = require("./config/cors");
const environment = require("./config/environment");
const { errorHandler, notFoundHandler, requestLogger } = require("./middlewares/middleware");

const app = express();

const hostname = environment.HOSTNAME;
const port = environment.PORT;

// Middleware
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger); // Log requests

// Routes
const testRoutes = require("./routes/testRoutes");

app.get("/", (req, res) => {
  res.json({
    message: "Job Search API Server",
    version: "1.0.0",
    environment: environment.NODE_ENV,
    endpoints: {
      testConnection: "/api/test/test-connection"
    }
  });
});

// API Routes
app.use("/api/test", testRoutes);

// Error handling middleware (phải đặt sau tất cả routes)
app.use(notFoundHandler); // 404 handler
app.use(errorHandler); // Error handler

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server is running at http://${hostname}:${port}/`
  );
  console.log(`📡 Environment: ${environment.NODE_ENV}`);
  console.log(`🔗 Test API: http://${hostname}:${port}/api/test`);
});
