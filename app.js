// Core modules & packages
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const swaggerDocument = yaml.load('./swagger/swagger.yaml');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Monitoring & logging
const client = require('prom-client');
const gelf = require('gelf-pro');
const collectDefaultMetrics = client.collectDefaultMetrics;

// Custom config & middleware
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const { requestLogger } = require('./middlewares/logger');
const verifyJWT = require('./middlewares/verifyJWT');

// Scheduled jobs
const cron = require('node-cron');
const clearOldLogs = require('./jobs/clearOldLogs.job');
cron.schedule('0 0 * * *', clearOldLogs);

// === Monitoring ===
collectDefaultMetrics({ timeout: 5000 });
const counterRequests = new client.Counter({
  name: 'node_requests_total',
  help: 'Total number of requests to the Node.js server',
  labelNames: ['method'],
});

// === Graylog (GELF) ===
gelf.setConfig({
  adapter: 'udp',
  adapterOptions: {
    protocol: 'udp4',
    host: 'logstash',
    port: 12201,
  },
});

// === Express App ===
const app = express();

// === Middleware ===
app.use(requestLogger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// === Monitoring Logging ===
app.use((req, res, next) => {
  gelf.info(`Received ${req.method} request for ${req.url}`);
  counterRequests.inc({ method: req.method });
  next();
});

// === /metrics Endpoint ===
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).end();
  }
});

// === Health Check ===
app.use('/healthCheck', require('./routes/healthCheck'));

// === Static Files & View Engine ===
app.use('/', express.static(path.join(__dirname, '/')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
  res.status(200).render('index');
});

// === Public Routes ===
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refreshToken', require('./routes/refreshToken'));
app.use('/logout', require('./routes/logout'));

// === React App (optional) ===
if (process.env.NODE_ENV === 'build') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// === Protected Routes ===
app.use('/airport', verifyJWT, require('./routes/airport'));
app.use('/flight', verifyJWT, require('./routes/flight'));
app.use('/user', verifyJWT, require('./routes/user'));

// === 404 Fallback ===
app.use((req, res) => {
  res.status(404).render('404', { url: req.originalUrl });
});

module.exports = app;
