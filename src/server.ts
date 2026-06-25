import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './infra/logger/logger.js';

const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});