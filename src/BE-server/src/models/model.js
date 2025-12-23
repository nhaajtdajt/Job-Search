// Base model template
// Models có thể được sử dụng để định nghĩa schema hoặc data structure

/**
 * Example: User model structure
 */
const UserModel = {
  tableName: 'users',
  fields: {
    user_id: 'UUID PRIMARY KEY',
    name: 'TEXT',
    gender: 'VARCHAR(10)',
    date_of_birth: 'DATE',
    phone: 'VARCHAR(15)',
    address: 'TEXT',
    avatar_url: 'TEXT'
  }
};

/**
 * Example: Job model structure
 */
const JobModel = {
  tableName: 'job',
  fields: {
    job_id: 'BIGINT PRIMARY KEY',
    employer_id: 'BIGINT',
    job_title: 'TEXT',
    description: 'TEXT',
    requirements: 'TEXT',
    benefits: 'TEXT',
    salary_min: 'NUMERIC(15, 2)',
    salary_max: 'NUMERIC(15, 2)',
    job_type: 'VARCHAR(50)',
    posted_at: 'TIMESTAMPTZ',
    expired_at: 'TIMESTAMPTZ',
    views: 'INT'
  }
};

module.exports = {
  UserModel,
  JobModel
};

