// Re-export all constants for easier imports
const HTTP_STATUS = require('./http-status');
const MODULE = require('./module');
const ROLE = require('./role');
const MESSAGES = require('./messages');
const { JOB_TYPES, APPLICATION_STATUS } = require('./job');

module.exports = {
  HTTP_STATUS,
  MODULE,
  ROLE,
  MESSAGES,
  JOB_TYPES,
  APPLICATION_STATUS
};
