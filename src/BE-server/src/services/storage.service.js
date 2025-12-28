const sharp = require('sharp');
const storageConfig = require('../configs/storage.config');
const FileUtil = require('../utils/file.util');
const { BadRequestError, AppError } = require('../errors');

/**
 * Storage Service
 * Handle file upload/download/delete using Supabase Storage
 */
class StorageService {
  /**
   * Get Supabase client
   * @private
   * @throws {AppError} If Supabase is not configured
   */
  static getClient() {
    if (!storageConfig.client) {
      throw new AppError(
        'Storage service not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
        500
      );
    }
    return storageConfig.client;
  }

  // ============================================
  // Core Upload/Download/Delete Methods
  // ============================================

  /**
   * Upload file to Supabase Storage
   * @param {Buffer} fileBuffer - File content as buffer
   * @param {string} filePath - Path in bucket (e.g., 'avatars/users/123/avatar.jpg')
   * @param {string} contentType - MIME type
   * @returns {Promise<Object>} { url, path }
   */
  static async uploadFile(fileBuffer, filePath, contentType) {
    try {
      const client = this.getClient();
      
      const { data, error } = await client.storage
        .from(storageConfig.bucket)
        .upload(filePath, fileBuffer, {
          contentType,
          upsert: true, // Replace if exists
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new AppError(`Failed to upload file: ${error.message}`, 500);
      }

      // Get public URL
      const url = this.getPublicUrl(filePath);

      return {
        url,
        path: data.path,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Upload failed: ${error.message}`, 500);
    }
  }

  /**
   * Delete file from storage
   * @param {string} filePath - Path in bucket or full URL
   * @returns {Promise<void>}
   */
  static async deleteFile(filePath) {
    try {
      const client = this.getClient();
      
      // Extract path from URL if necessary
      const path = this.extractPathFromUrl(filePath);
      
      const { error } = await client.storage
        .from(storageConfig.bucket)
        .remove([path]);

      if (error) {
        console.error('Supabase delete error:', error);
        // Don't throw error if file doesn't exist
        if (error.message.includes('not found')) {
          return;
        }
        throw new AppError(`Failed to delete file: ${error.message}`, 500);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Delete file error:', error);
      // Don't fail the operation if delete fails
    }
  }

  /**
   * Download file from storage
   * @param {string} filePath - Path in bucket
   * @returns {Promise<Buffer>} File buffer
   */
  static async downloadFile(filePath) {
    try {
      const client = this.getClient();
      
      const path = this.extractPathFromUrl(filePath);
      
      const { data, error } = await client.storage
        .from(storageConfig.bucket)
        .download(path);

      if (error) {
        console.error('Supabase download error:', error);
        throw new AppError(`Failed to download file: ${error.message}`, 500);
      }

      // Convert blob to buffer
      const arrayBuffer = await data.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Download failed: ${error.message}`, 500);
    }
  }

  /**
   * Get public URL for a file
   * @param {string} filePath - Path in bucket
   * @returns {string} Public URL
   */
  static getPublicUrl(filePath) {
    const client = this.getClient();
    
    const { data } = client.storage
      .from(storageConfig.bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Get signed URL (temporary access)
   * @param {string} filePath - Path in bucket
   * @param {number} expiresIn - Expiry time in seconds (default: 1 hour)
   * @returns {Promise<string>} Signed URL
   */
  static async getSignedUrl(filePath, expiresIn = 3600) {
    try {
      const client = this.getClient();
      
      const path = this.extractPathFromUrl(filePath);
      
      const { data, error } = await client.storage
        .from(storageConfig.bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        throw new AppError(`Failed to generate signed URL: ${error.message}`, 500);
      }

      return data.signedUrl;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Signed URL generation failed: ${error.message}`, 500);
    }
  }

  // ============================================
  // Image Processing
  // ============================================

  /**
   * Process avatar image (resize and optimize)
   * @param {Buffer} buffer - Image buffer
   * @returns {Promise<Buffer>} Processed buffer
   */
  static async processAvatar(buffer) {
    const { width, height, fit, quality } = storageConfig.imageProcessing.avatar;
    
    return await sharp(buffer)
      .resize(width, height, { fit, position: 'center' })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  /**
   * Process logo image
   * @param {Buffer} buffer - Image buffer
   * @returns {Promise<Buffer>} Processed buffer
   */
  static async processLogo(buffer) {
    const { width, height, fit, quality } = storageConfig.imageProcessing.logo;
    
    return await sharp(buffer)
      .resize(width, height, { fit, background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png({ quality, compressionLevel: 9 })
      .toBuffer();
  }

  /**
   * Process banner image
   * @param {Buffer} buffer - Image buffer
   * @returns {Promise<Buffer>} Processed buffer
   */
  static async processBanner(buffer) {
    const { width, height, fit, quality } = storageConfig.imageProcessing.banner;
    
    return await sharp(buffer)
      .resize(width, height, { fit, position: 'center' })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }

  // ============================================
  // Specialized Upload Methods
  // ============================================

  /**
   * Upload avatar (user or employer)
   * @param {Buffer} fileBuffer - Image buffer
   * @param {string} userId - User ID
   * @param {string} type - 'user' or 'employer'
   * @returns {Promise<Object>} { url, path }
   */
  static async uploadAvatar(fileBuffer, userId, type = 'user') {
    try {
      // Process image
      const processedBuffer = await this.processAvatar(fileBuffer);
      
      // Generate filename
      const filename = FileUtil.generateFileName('avatar', userId, 'jpg');
      
      // Generate path
      const folder = type === 'user' 
        ? storageConfig.folders.avatars.users 
        : storageConfig.folders.avatars.employers;
      const filePath = FileUtil.generateFilePath(folder, userId, filename);
      
      // Upload
      return await this.uploadFile(processedBuffer, filePath, 'image/jpeg');
    } catch (error) {
      throw new AppError(`Avatar upload failed: ${error.message}`, 500);
    }
  }

  /**
   * Upload company logo
   * @param {Buffer} fileBuffer - Image buffer
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} { url, path }
   */
  static async uploadCompanyLogo(fileBuffer, companyId) {
    try {
      // Process logo
      const processedBuffer = await this.processLogo(fileBuffer);
      
      // Generate filename
      const filename = FileUtil.generateFileName('logo', companyId, 'png');
      
      // Generate path
      const filePath = FileUtil.generateFilePath(
        storageConfig.folders.companies,
        companyId,
        filename
      );
      
      // Upload
      return await this.uploadFile(processedBuffer, filePath, 'image/png');
    } catch (error) {
      throw new AppError(`Logo upload failed: ${error.message}`, 500);
    }
  }

  /**
   * Upload company banner
   * @param {Buffer} fileBuffer - Image buffer
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} { url, path }
   */
  static async uploadCompanyBanner(fileBuffer, companyId) {
    try {
      // Process banner
      const processedBuffer = await this.processBanner(fileBuffer);
      
      // Generate filename
      const filename = FileUtil.generateFileName('banner', companyId, 'jpg');
      
      // Generate path
      const filePath = FileUtil.generateFilePath(
        storageConfig.folders.companies,
        companyId,
        filename
      );
      
      // Upload
      return await this.uploadFile(processedBuffer, filePath, 'image/jpeg');
    } catch (error) {
      throw new AppError(`Banner upload failed: ${error.message}`, 500);
    }
  }

  /**
   * Upload resume PDF
   * @param {Buffer} fileBuffer - PDF buffer
   * @param {string} userId - User ID
   * @param {string} resumeId - Resume ID
   * @returns {Promise<Object>} { url, path }
   */
  static async uploadResumePDF(fileBuffer, userId, resumeId) {
    try {
      // Generate filename
      const filename = FileUtil.generateFileName(`resume_${resumeId}`, userId, 'pdf');
      
      // Generate path
      const filePath = FileUtil.generateFilePath(
        storageConfig.folders.resumes,
        userId,
        filename
      );
      
      // Upload (no processing for PDF)
      return await this.uploadFile(fileBuffer, filePath, 'application/pdf');
    } catch (error) {
      throw new AppError(`Resume upload failed: ${error.message}`, 500);
    }
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Extract file path from Supabase URL
   * @param {string} urlOrPath - Full URL or path
   * @returns {string} File path
   */
  static extractPathFromUrl(urlOrPath) {
    if (!urlOrPath) return '';
    
    // If already a path (no http), return as is
    if (!urlOrPath.startsWith('http')) {
      return urlOrPath;
    }
    
    // Extract path from URL
    // URL format: https://.../storage/v1/object/public/bucket-name/path/to/file
    try {
      const url = new URL(urlOrPath);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === storageConfig.bucket);
      
      if (bucketIndex === -1) {
        // Fallback: take everything after 'public/'
        const publicIndex = pathParts.indexOf('public');
        return pathParts.slice(publicIndex + 2).join('/');
      }
      
      return pathParts.slice(bucketIndex + 1).join('/');
    } catch (error) {
      // If URL parsing fails, try simple split
      const parts = urlOrPath.split(storageConfig.bucket + '/');
      return parts.length > 1 ? parts[1] : urlOrPath;
    }
  }

  /**
   * Delete old file when uploading new one
   * @param {string} oldUrl - Old file URL to delete
   * @returns {Promise<void>}
   */
  static async deleteOldFile(oldUrl) {
    if (!oldUrl) return;
    
    try {
      await this.deleteFile(oldUrl);
    } catch (error) {
      // Log but don't fail the operation
      console.warn('Failed to delete old file:', error.message);
    }
  }

  /**
   * Check if storage is configured
   * @returns {boolean}
   */
  static isConfigured() {
    return storageConfig.client !== null;
  }
}

module.exports = StorageService;
