const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');
const fs = require('fs');

const logsDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} level=${level} message=${message}`;
});

const logger = createLogger({
  levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
  level: process.env.LOG_LEVEL || 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: path.join(logsDir, 'node.log'),
      level: 'debug',
    }),
  ],
});

const requestLogger = (req, res, next) => {
  const origin = req.headers.origin || 'unknown';
  const logMessage = `${req.method} ${req.originalUrl} from ${origin}`;
  logger.http(logMessage);
  next();
};

module.exports = {
  logger,
  requestLogger,
};
