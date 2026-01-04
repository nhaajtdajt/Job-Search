const express = require("express");
const cors = require("./configs/cors.config");
const { requestLogger } = require("./middlewares/logger.middleware");
const { globalLimiter } = require("./middlewares/rate-limit.middleware");
const initRoute = require("./routes/index.route");
const ErrorHandler = require("./middlewares/error-handler.middleware");

const app = express();

// 1. CORS (first)
app.use(cors);

// 2. Rate Limiting (before body parsers to reject early)
app.use(globalLimiter);

// 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Request logging
app.use(requestLogger);

// 5. Routes
initRoute(app);

// 6. Error Handler (MUST be last)
app.use(ErrorHandler.handle);

module.exports = app;

