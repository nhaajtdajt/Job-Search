const knex = require("knex");
const config = require("../../knexfile");
console.log(config.development);
const db = knex(config.development);

module.exports = db;
