import 'dotenv/config';
import app from './src/app';
import Logger from './src/services/Logger';

const logger = Logger('server');

logger.debug('Getting port from environment');

const port = Number(process.env.PORT) || 80;

logger.debug(`Starting server on port ${port}...`);

app.listen(port, () => logger.info(`Server running on port ${port}`));
