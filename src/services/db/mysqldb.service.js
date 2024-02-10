const knex = require('knex');
const { decryptSecrets } = require('../../utils/common');
exports.GetDBConnection = () => {
  const _knex = knex({
    client: 'mysql',
    version: process.env.DBVERSION,
    connection: {
      host: decryptSecrets(process.env.DBHOST),
      user: decryptSecrets(process.env.DBUSERNAME),
      password: process.env.DBPASSWORD,
      database: decryptSecrets(process.env.DATABASE),
      port: 3306,
      acquireConnectionTimeout: 5000
    }
  });
  return _knex;
};
/* istanbul ignore next */
exports.GetDBDisconnection = (_knex) => {
  if (_knex !== null && _knex !== undefined) {
    _knex.destroy();
  }
};

exports.GetSyncDBConnection = () => {
  const _knex = knex({
    client: 'mysql',
    version: process.env.DBVERSION,
    connection: {
      host: decryptSecrets(process.env.DBHOST),
      user: decryptSecrets(process.env.DBUSERNAME),
      password: process.env.DBPASSWORD,
      database: decryptSecrets(process.env.DATABASE),
      port: 3306
    }
  });
  return _knex;
};

exports.GetSyncDBDisconnection = (_knex) => {
  if (_knex !== null && _knex !== undefined) {
    _knex.destroy();
  }
};
