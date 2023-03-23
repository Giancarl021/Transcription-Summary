import 'dotenv/config';
import app from './src/app';
import Logger from './src/services/Logger';
import constants from './src/util/constants';

const logger = Logger('server');

logger.debug('Getting port from environment');

const { port } = constants;

logger.debug(`Starting server on port ${port}...`);

app.listen(port, () => logger.info(`Server running on port ${port}`));
