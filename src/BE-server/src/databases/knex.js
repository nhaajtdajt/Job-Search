const knex = require("knex");
const config = require("../../knexfile");

// Validate config
if (!config.development) {
  throw new Error("Knex development config not found");
}

if (!config.development.connection?.connectionString) {
  throw new Error("DATABASE_URL is required in .env.development file");
}

const db = knex(config.development);

module.exports = db;
