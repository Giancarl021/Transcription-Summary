import { Configuration } from 'openai';
import constants from '../util/constants';
import Logger from '../services/Logger';

const logger = Logger('config:openAi');

logger.debug('Generating OpenAI configuration...');

const config = new Configuration({
    apiKey: constants.keys.openAi
});

logger.debug('Finished generating OpenAI configuration');

export default config;
