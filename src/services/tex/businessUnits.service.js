const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
// const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

const getBusinessUnitQuery = (queryObj, currentUser) => {
  let query = 'SELECT bu.* from tex_business_units bu ';
  const joinClause = ` JOIN tex_business_unit_user_types buut on buut.business_unit_id = bu.id
  JOIN tex_user_types ut on ut.id = buut.user_type_id `;
  const whereClause = ` WHERE ut.user_type = ${queryObj.userType}`;
  if (queryObj.userType) {
    query += (joinClause + whereClause);
    return query;
  }
  if (currentUser) {
    query += `, (
      SELECT @business_unit_id:= bu.id, @business_unit := bu.business_unit 
        FROM tex_business_units bu
      JOIN roles r on r.business_unit_id = bu.id
      JOIN users u on u.roleId = r.id
      WHERE 1 = 1
      AND u.username = '${currentUser}'
    ) vars
    WHERE 1 = 1
    AND bu.business_unit != 'ALL'
    AND IF(@business_unit = 'ALL', 1 = 1, bu.id = @business_unit_id)`;
    return query;
  }
  return query;
};

exports.fetchBusinessUnit = (paramObj, queryObj, currentUser) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    dbconnection.transaction((trx) => {
      transaction = trx;
      const fetchBusinessUnitsQuery = getBusinessUnitQuery(queryObj, currentUser);
      return dbconnection.raw(fetchBusinessUnitsQuery).transacting(transaction);
    })
      .then((businessUnitResult) => {
        logger.info('business units fetched from service', businessUnitResult);
        transaction.commit();
        resolve(businessUnitResult[0]);
      })
      .catch((error) => {
        logger.info('error in fetch business unit service', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
