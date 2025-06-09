const express = require('express');
const healthCheckController = require('../controllers/healthCheckController');

const router = express.Router();

router.get('/postgresHealth', healthCheckController.checkPostgres);
router.get('/neo4jHealth', healthCheckController.checkNeo4j);

module.exports = router;
