const multer = require('multer');
const storageConfig = require('../configs/storage.config');
const FileUtil = require('../utils/file.util');
const { BadRequestError } = require('../errors');

/**
 * Upload Middleware
 * Multer configuration for file uploads
 */

// Use memory storage (files are stored in buffer, not disk)
const storage = multer.memoryStorage();

/**
 * Generic file filter
 * @param {Array<string>} allowedTypes - Array of allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Function} Multer fileFilter function
 */
const createFileFilter = (allowedTypes, maxSize) => {
  return (req, file, cb) => {
    // Check file type
    if (!FileUtil.validateFileType(file, allowedTypes)) {
      return cb(
        new BadRequestError(
          `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        ),
        false
      );
    }

    // File size will be checked by multer limits
    cb(null, true);
  };
};

/**
 * Error handler for multer
 * @param {Error} err - Multer error
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new BadRequestError('File too large'));
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return next(new BadRequestError('Unexpected field'));
    }
    return next(new BadRequestError(err.message));
  }
  next(err);
};

// ============================================
// Image Upload Middleware (Avatar, Logo, Banner)
// ============================================

/**
 * Avatar upload middleware (User/Employer)
 * Max size: 5MB
 * Allowed types: JPG, PNG, WEBP
 */
const uploadAvatar = multer({
  storage: storage,
  limits: {
    fileSize: storageConfig.limits.image,
  },
  fileFilter: createFileFilter(
    storageConfig.allowedTypes.image,
    storageConfig.limits.image
  ),
}).single('avatar');

/**
 * Company logo upload middleware
 * Max size: 5MB
 * Allowed types: JPG, PNG, WEBP
 */
const uploadLogo = multer({
  storage: storage,
  limits: {
    fileSize: storageConfig.limits.image,
  },
  fileFilter: createFileFilter(
    storageConfig.allowedTypes.image,
    storageConfig.limits.image
  ),
}).single('logo');

/**
 * Company banner upload middleware
 * Max size: 10MB
 * Allowed types: JPG, PNG, WEBP
 */
const uploadBanner = multer({
  storage: storage,
  limits: {
    fileSize: storageConfig.limits.pdf, // Using PDF limit for larger size
  },
  fileFilter: createFileFilter(
    storageConfig.allowedTypes.image,
    storageConfig.limits.pdf
  ),
}).single('banner');

// ============================================
// PDF Upload Middleware (Resume/CV)
// ============================================

/**
 * CV/Resume upload middleware
 * Max size: 10MB
 * Allowed types: PDF only
 */
const uploadCV = multer({
  storage: storage,
  limits: {
    fileSize: storageConfig.limits.pdf,
  },
  fileFilter: createFileFilter(
    storageConfig.allowedTypes.pdf,
    storageConfig.limits.pdf
  ),
}).single('cv');

// ============================================
// Wrapper functions with error handling
// ============================================

/**
 * Wrap multer middleware with error handler
 * @param {Function} uploadFn - Multer middleware
 * @returns {Function[]} Array of middleware functions
 */
const wrapUpload = (uploadFn) => {
  return [
    (req, res, next) => {
      uploadFn(req, res, (err) => {
        if (err) {
          return handleMulterError(err, req, res, next);
        }
        next();
      });
    },
  ];
};

// ============================================
// Export wrapped middleware
// ============================================

module.exports = {
  // Single middleware (original, for compatibility)
  uploadAvatar,
  uploadLogo,
  uploadBanner,
  uploadCV,
  
  // Wrapped with error handling (recommended)
  uploadAvatarSafe: wrapUpload(uploadAvatar)[0],
  uploadLogoSafe: wrapUpload(uploadLogo)[0],
  uploadBannerSafe: wrapUpload(uploadBanner)[0],
  uploadCVSafe: wrapUpload(uploadCV)[0],
  
  // Error handler (can be used separately)
  handleMulterError,
};
