/**
 * Employer Status Constants
 * Defines the allowed status values for employers
 */
const EMPLOYER_STATUS = {
    VERIFIED: 'verified',     // Employer is verified and can post jobs
    SUSPENDED: 'suspended'    // Employer is suspended, cannot post jobs or manage applications
};

// Default status for new employers (will need admin verification)
const DEFAULT_EMPLOYER_STATUS = EMPLOYER_STATUS.VERIFIED;

module.exports = { EMPLOYER_STATUS, DEFAULT_EMPLOYER_STATUS };
