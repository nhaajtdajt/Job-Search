require('dotenv').config();

const environment = {
  // Server config
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8017,
  HOSTNAME: process.env.HOSTNAME || 'localhost',

  // Supabase config
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY, // Optional, cho admin operations

  // JWT config (nếu cần)
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_KEY'];
const missingEnvVars = requiredEnvVars.filter(key => !environment[key]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}

module.exports = environment;

