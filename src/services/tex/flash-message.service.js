const { GetCRMDBConnection, GetOracleDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { DCAFlashMessagesQuery, winleadFlashMessagesQuery } = require('../../config/dbqueries');
const { logger } = require('../../utils/logger');

/**
 * To Get the falsh message info from CRM DB based on Acc Id.
 */
exports.getFlashMessageInfo = async (params, roleType) => {
  logger.info(`flash message Info Service Request  ${params} & RoleType is ${roleType}`);
  const query = roleType.includes('dca')
    ? DCAFlashMessagesQuery()
    : winleadFlashMessagesQuery();
  return new Promise((resolve, reject) => {
    const dbconnection = GetCRMDBConnection();
    logger.info('flash message Info Query for DCA:', DCAFlashMessagesQuery());
    logger.info('flash message Info Query:', winleadFlashMessagesQuery());
    dbconnection
      .raw(query, params)
      .then((success) => {
        logger.info('flash message Info Service Response:', success);
        const response = {
          resultcode: successCode,
          body: success
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed flash message Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetOracleDBDisconnection(dbconnection);
      });
  });
};
