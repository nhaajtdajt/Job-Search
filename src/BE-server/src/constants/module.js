// Database table names (extracted from migrations)
module.exports = {
  // Core tables
  USERS: "users",
  COMPANY: "company",
  EMPLOYER: "employer",
  
  // Job tables
  JOB: "job",
  TAG: "tag",
  JOB_TAG: "job_tag",
  LOCATION: "location",
  JOB_LOCATION: "job_location",
  SAVED_JOB: "saved_job",
  JOB_SKILL: "job_skill",
  
  // Resume tables
  RESUME: "resume",
  RES_EDUCATION: "res_education",
  RES_EXPERIENCE: "res_experience",
  RESUME_SKILL: "resume_skill",
  RESUME_VIEW: "resume_view",
  
  // Application & Notifications
  APPLICATION: "application",
  NOTIFICATION: "notification",
  
  // Skills & Search
  SKILL: "skill",
  SAVED_SEARCH: "saved_search",
  SAVED_CANDIDATE: "saved_candidate",
};
