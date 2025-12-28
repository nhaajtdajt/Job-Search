/**
 * Logger Middleware
 * Request logging for debugging and monitoring
 */

/**
 * Log incoming requests with timestamp, method and path
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path}`);
  next();
};

/**
 * Detailed request logger with response time
 */
const detailedLogger = (req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log request
  console.log(`[${timestamp}] --> ${req.method} ${req.originalUrl}`);
  
  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] <-- ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

module.exports = {
  requestLogger,
  detailedLogger,
};
