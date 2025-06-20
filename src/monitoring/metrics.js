const client = require('prom-client');
const register = new client.Registry();

client.collectDefaultMetrics({ register });

const usersOnline = new client.Gauge({ name: 'users_online', help: 'Number of current users' });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});

const serverErrorCounter = new client.Counter({
  name: 'http_5xx_errors_total',
  help: 'Number of server errors (5xx)',
  labelNames: ['route'],
});

const clientErrorCounter = new client.Counter({
  name: 'http_4xx_errors_total',
  help: 'Number of client errors (4xx)',
  labelNames: ['route'],
});

const responseSizeHistogram = new client.Histogram({
  name: 'http_response_size_bytes',
  help: 'Size of HTTP responses in bytes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [500, 1000, 5000, 10000, 50000, 100000, 1000000],
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(serverErrorCounter);
register.registerMetric(clientErrorCounter);
register.registerMetric(responseSizeHistogram);
register.registerMetric(usersOnline);

const prometheusMiddleware = (req, res, next) => {
  const route = req.route?.path || req.path;
  const endTimer = httpRequestDuration.startTimer({ method: req.method, route });

  res.on('finish', () => {
    const statusCodeStr = res.statusCode.toString(); // status_code jako string!

    const labels = {
      method: req.method,
      route,
      status_code: statusCodeStr,
    };

    httpRequestCounter.inc(labels);
    endTimer({ status_code: statusCodeStr });

    const contentLength = parseInt(res.getHeader('Content-Length')) || 0;
    responseSizeHistogram.observe(labels, contentLength);

    if (res.statusCode >= 500 && res.statusCode < 600) {
      serverErrorCounter.inc({ route });
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      clientErrorCounter.inc({ route });
    }
  });

  next();
};

const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch {
    res.status(500).end();
  }
};

module.exports = {
  prometheusMiddleware,
  metricsEndpoint,
  usersOnline,
};
