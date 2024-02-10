const { decryptSecrets } = require('../utils/common');
const crmDbConfig = {
  user: decryptSecrets(process.env.CRMDBUSERNAME),
  password: decryptSecrets(process.env.CRMDBPASSWORD),
  database: decryptSecrets(process.env.CRMDATABASE),
  host: decryptSecrets(process.env.CRMDBHOST)
};

const rnlDbConfig = {
  user: decryptSecrets(process.env.RNLDBUSERNAME),
  password: decryptSecrets(process.env.RNLDBPASSWORD),
  database: decryptSecrets(process.env.RNLDATABASE),
  host: decryptSecrets(process.env.RNLDBHOST)
};

const omsDbConfig = {
  user: decryptSecrets(process.env.OMSDBUSERNAME),
  password: decryptSecrets(process.env.OMSDBPASSWORD),
  database: decryptSecrets(process.env.OMSDATABASE),
  host: decryptSecrets(process.env.OMSDBHOST)
};

module.exports = {
  crmDbConfig,
  omsDbConfig,
  rnlDbConfig
};
