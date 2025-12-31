/**
 * Admin Configuration
 * Defines which email addresses have admin privileges
 * 
 * To add a new admin:
 * 1. Add their email to ADMIN_EMAILS array
 * 2. Create their account via seed or register API
 */
module.exports = {
    ADMIN_EMAILS: [
        'admin@jobsearch.com',
        'admin2@jobsearch.com',
        'superadmin@jobsearch.com'
    ]
};
