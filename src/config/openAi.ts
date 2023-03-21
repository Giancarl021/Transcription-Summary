import { Configuration } from 'openai';
import constants from '../util/constants';

const config = new Configuration({
    apiKey: constants.keys.openAi
});

export default config;
