const fs = require('fs');
const path = require('path');

const clearOldLogs = () => {
  const logDir = path.join(__dirname, '..', 'logs');
  console.log(`Starting to clear old logs in directory: ${logDir}`);
  fs.readdir(logDir, (err, files) => {
    files.forEach(file => {
      const filePath = path.join(logDir, file);
      const fileStats = fs.statSync(filePath);
      const currentTime = Date.now();
      const fileAge = currentTime - fileStats.mtimeMs;
      if (fileAge > 7 * 24 * 60 * 60 * 1000) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    });
  });
};

module.exports = clearOldLogs;
