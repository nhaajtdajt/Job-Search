require('dotenv').config({ path: '.env.development' });

const environment = {
  // Server config
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 8017,
  HOSTNAME: process.env.HOSTNAME || 'localhost',

  // Supabase config
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // JWT config
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Frontend URL (for redirects)
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Email config (for nodemailer)
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE || 'false',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};

module.exports = environment;
