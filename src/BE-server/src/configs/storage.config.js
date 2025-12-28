const { createClient } = require('@supabase/supabase-js');

/**
 * Storage Configuration
 * Setup Supabase Storage client and limits
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Storage configuration
const storageConfig = {
  // Supabase client instance
  client: supabase,
  
  // Bucket name
  bucket: process.env.SUPABASE_STORAGE_BUCKET || 'job-search-storage',
  
  // File size limits (in bytes)
  limits: {
    image: parseInt(process.env.MAX_FILE_SIZE_IMAGE) || 5 * 1024 * 1024, // 5MB
    pdf: parseInt(process.env.MAX_FILE_SIZE_PDF) || 10 * 1024 * 1024,    // 10MB
  },
  
  // Allowed MIME types
  allowedTypes: {
    image: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    pdf: ['application/pdf'],
  },
  
  // Storage folders
  folders: {
    avatars: {
      users: 'avatars/users',
      employers: 'avatars/employers',
    },
    companies: 'companies',
    resumes: 'resumes',
  },
  
  // Image processing settings
  imageProcessing: {
    avatar: {
      width: 400,
      height: 400,
      fit: 'cover',
      quality: 85,
    },
    logo: {
      width: 300,
      height: 300,
      fit: 'contain',
      quality: 90,
    },
    banner: {
      width: 1200,
      height: 400,
      fit: 'cover',
      quality: 85,
    },
  },
};

// Validate Supabase configuration
if (!supabase) {
  console.warn('⚠️  WARNING: Supabase client not initialized. File upload will not work.');
  console.warn('   Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
}

module.exports = storageConfig;
