// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Response messages
const MESSAGES = {
  SUCCESS: 'Success',
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  BAD_REQUEST: 'Bad request',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error'
};

// Job types
const JOB_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE: 'Freelance'
};

// Application status
const APPLICATION_STATUS = {
  PENDING: 'Pending',
  REVIEWING: 'Reviewing',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn'
};

// User roles
const USER_ROLES = {
  JOB_SEEKER: 'job_seeker',
  EMPLOYER: 'employer',
  ADMIN: 'admin'
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
  JOB_TYPES,
  APPLICATION_STATUS,
  USER_ROLES
};

