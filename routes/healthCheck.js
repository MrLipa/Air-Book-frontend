const express = require('express');
const { pool, session } = require('../config/db');

const router = express.Router();

router.get('/postgresHealth', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('✅ PostgreSQL OK');
  } catch (error) {
    res.status(500).send(`❌ PostgreSQL error: ${error.message}`);
  }
});

router.get('/neo4jHealth', async (req, res) => {
  try {
    await session.run('RETURN 1');
    res.status(200).send('✅ Neo4j OK');
  } catch (error) {
    res.status(500).send(`❌ Neo4j error: ${error.message}`);
  }
});

module.exports = router;
