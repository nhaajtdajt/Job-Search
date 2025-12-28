require("dotenv").config({ path: '.env.development' });

module.exports = {
  development: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    pool: { min: 0, max: 3 },
    migrations: {
      directory: "./src/databases/migrations",
    },
    seeds: {
      directory: "./src/databases/seeds",
    },
  },
};