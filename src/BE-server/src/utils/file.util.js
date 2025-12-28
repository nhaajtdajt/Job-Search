const path = require('path');
const { fileTypeFromBuffer } = require('file-type');

/**
 * File Utilities
 * Helper functions for file validation, naming, and processing
 */
class FileUtil {
  /**
   * Validate file type against allowed types
   * @param {Object} file - Multer file object
   * @param {Array<string>} allowedTypes - Array of allowed MIME types
   * @returns {boolean}
   */
  static validateFileType(file, allowedTypes) {
    if (!file || !file.mimetype) {
      return false;
    }
    return allowedTypes.includes(file.mimetype);
  }

  /**
   * Validate file size
   * @param {Object} file - Multer file object
   * @param {number} maxSize - Maximum size in bytes
   * @returns {boolean}
   */
  static validateFileSize(file, maxSize) {
    if (!file || !file.size) {
      return false;
    }
    return file.size <= maxSize;
  }

  /**
   * Generate unique filename with timestamp
   * @param {string} prefix - Prefix for the filename (e.g., 'avatar', 'logo')
   * @param {string} userId - User or resource ID
   * @param {string} ext - File extension (with or without dot)
   * @returns {string} Generated filename
   */
  static generateFileName(prefix, userId, ext) {
    const timestamp = Date.now();
    const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
    const sanitizedPrefix = this.sanitizeFileName(prefix);
    return `${sanitizedPrefix}_${userId}_${timestamp}${cleanExt}`;
  }

  /**
   * Get file extension from filename
   * @param {string} filename - Original filename
   * @returns {string} Extension without dot
   */
  static getFileExtension(filename) {
    if (!filename) return '';
    const ext = path.extname(filename);
    return ext ? ext.slice(1).toLowerCase() : '';
  }

  /**
   * Sanitize filename - remove special characters
   * @param {string} filename - Filename to sanitize
   * @returns {string} Sanitized filename
   */
  static sanitizeFileName(filename) {
    if (!filename) return '';
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
      .replace(/^_|_$/g, '');       // Remove leading/trailing underscores
  }

  /**
   * Check if file is an image
   * @param {string} mimetype - MIME type
   * @returns {boolean}
   */
  static isImage(mimetype) {
    return mimetype && mimetype.startsWith('image/');
  }

  /**
   * Check if file is a PDF
   * @param {string} mimetype - MIME type
   * @returns {boolean}
   */
  static isPDF(mimetype) {
    return mimetype === 'application/pdf';
  }

  /**
   * Verify file type from buffer (more secure than checking mimetype)
   * @param {Buffer} buffer - File buffer
   * @returns {Promise<Object|null>} File type info or null
   */
  static async verifyFileType(buffer) {
    try {
      return await fileTypeFromBuffer(buffer);
    } catch (error) {
      return null;
    }
  }

  /**
   * Format file size to human readable format
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted size (e.g., "1.5 MB")
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Generate file path for storage
   * @param {string} folder - Base folder
   * @param {string} userId - User/Resource ID
   * @param {string} filename - Generated filename
   * @returns {string} Full path
   */
  static generateFilePath(folder, userId, filename) {
    return `${folder}/${userId}/${filename}`;
  }

  /**
   * Extract filename from URL or path
   * @param {string} urlOrPath - URL or file path
   * @returns {string} Filename
   */
  static extractFilename(urlOrPath) {
    if (!urlOrPath) return '';
    const parts = urlOrPath.split('/');
    return parts[parts.length - 1];
  }

  /**
   * Get MIME type from extension
   * @param {string} ext - File extension
   * @returns {string} MIME type
   */
  static getMimeType(ext) {
    const mimeTypes = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      pdf: 'application/pdf',
    };
    const cleanExt = ext.toLowerCase().replace('.', '');
    return mimeTypes[cleanExt] || 'application/octet-stream';
  }

  /**
   * Validate if filename is safe (no path traversal)
   * @param {string} filename - Filename to check
   * @returns {boolean}
   */
  static isSafeFilename(filename) {
    if (!filename) return false;
    // Check for path traversal attempts
    return !filename.includes('..') && !filename.includes('/') && !filename.includes('\\');
  }
}

module.exports = FileUtil;
