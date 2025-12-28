const express = require("express");
const cors = require("./configs/cors.config");
const { requestLogger } = require("./middlewares/logger.middleware");
const initRoute = require("./routes/index.route");
const ErrorHandler = require("./middlewares/error-handler.middleware");

const app = express();

// 1. CORS (first)
app.use(cors);

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request logging
app.use(requestLogger);

// 4. Routes
initRoute(app);

// 5. Error Handler (MUST be last)
app.use(ErrorHandler.handle);

module.exports = app;
