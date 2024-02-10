const { GetOMSDBConnection, GetOracleDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { DCAFreePreviewQuery, winleadFreePreviewQuery } = require('../../config/dbqueries');
const { logger } = require('../../utils/logger');

/**
 * To Get the free preview info from OMS DB based on Acc Id.
 */
exports.getFreePreviewInfo = async (params, roleType) => {
  logger.info(`Subscription Info Service Request  ${params} & RoleType is ${roleType}`);
  return new Promise((resolve, reject) => {
    const query = roleType.includes('dca')
      ? DCAFreePreviewQuery()
      : winleadFreePreviewQuery();
    const dbconnection = GetOMSDBConnection();
    logger.info('free preview Info Query for use:', query);
    logger.info('free preview Info Query:', winleadFreePreviewQuery());
    dbconnection
      .raw(query, params)
      .then((success) => {
        logger.info('free preview Info Service Response:', success);
        const response = {
          resultcode: successCode,
          body: success
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed free preview Service: ', error);
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
