// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Supabase error
  if (err.code && err.message) {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      error: err.message
    });
  }

  // Validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: err.message
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: 'Unauthorized'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 Not Found middleware
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// Request logger middleware (optional)
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger
};

