/**
 * Email Configuration
 * Centralized email settings for the application
 */
const environment = require('./environment.config');

const emailConfig = {
    // SMTP Configuration
    smtp: {
        host: environment.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(environment.EMAIL_PORT) || 587,
        secure: environment.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: environment.EMAIL_USER?.trim(),
            pass: environment.EMAIL_PASSWORD?.trim().replace(/\s/g, '') // Remove spaces for Gmail App Password
        }
    },

    // Default sender
    from: {
        name: 'Job Search',
        email: environment.EMAIL_USER || 'noreply@jobsearch.com'
    },

    // Template directory
    templatesDir: './src/templates/email',

    // Feature flags
    enabled: !!(environment.EMAIL_USER && environment.EMAIL_PASSWORD)
};

/**
 * Validate email configuration
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateConfig() {
    const errors = [];

    if (!emailConfig.smtp.auth.user) {
        errors.push('EMAIL_USER is not configured');
    } else if (emailConfig.smtp.auth.user.includes('your-email') || emailConfig.smtp.auth.user.includes('example.com')) {
        errors.push('EMAIL_USER is using placeholder value');
    }

    if (!emailConfig.smtp.auth.pass) {
        errors.push('EMAIL_PASSWORD is not configured');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = {
    ...emailConfig,
    validateConfig
};
