const app = require('./src/app');
const { logger } = require('./src/middlewares/logger');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
