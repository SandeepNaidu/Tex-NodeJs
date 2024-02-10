console.log('Env Type', process.env.NODE_ENV);
const envPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
console.log('Env', envPath);
require('dotenv-safe').config({ path: envPath });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  testenv: process.env.TESTENV,
  logs: 'dev',
  serviceName: 'tex-service',
  paramaterStoreKeyNames: [
  ],
  environments: [
    'NODE_ENV',
    'PORT',
    'DBVERSION',
    'DBHOST',
    'DBUSERNAME',
    'DBPASSWORD',
    'DATABASE',
    'HTTP_TIMEOUT',
    'AWS_REGION'
  ],
  cachedBootTasks: [],
  whitelistPatterns: [],
  httpTimeout: process.env.HTTP_TIMEOUT,
  successCode: '01',
  errorCode: '05',
  errorInfo: 'A generic error occurred on the server ',
  meshAddonCid: '1665086',
  elasticSearchAPI: 'https://search-odsdata-xvm6bwlsl63gcxvfbfxrtr7wz4.ap-southeast-1.es.amazonaws.com'
};
