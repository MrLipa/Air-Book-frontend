const { pool, session } = require('../config/db');

const checkPostgres = async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('✅ PostgreSQL OK');
  } catch (error) {
    res.status(500).send(`❌ PostgreSQL error: ${error.message}`);
  }
};

const checkNeo4j = async (req, res) => {
  try {
    await session.run('RETURN 1');
    res.status(200).send('✅ Neo4j OK');
  } catch (error) {
    res.status(500).send(`❌ Neo4j error: ${error.message}`);
  }
};

module.exports = {
  checkPostgres,
  checkNeo4j,
};
