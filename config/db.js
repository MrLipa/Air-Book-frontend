const neo4j = require("neo4j-driver");
const Pool = require("pg").Pool;
require('dotenv').config()

const pool = new Pool({
  user: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  host: process.env.POSTGRES_DB_HOST,
  port: process.env.POSTGRES_DB_PORT,
  database: process.env.POSTGRES_DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
});

const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;
const neo4jDriver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));
const session = neo4jDriver.session();

module.exports = {
  pool,
  session,
};
