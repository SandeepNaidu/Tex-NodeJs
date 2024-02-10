const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
// const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

const getUserTypesQuery = (queryObj, currentUser) => {
  let query = `SELECT distinct ut.id, ut.user_type, ut.user_type_name, buut.parent_user_type_id, bu.business_unit FROM tex_user_types ut
    JOIN roles r ON r.user_type_id = ut.id
    JOIN sub_roles sr ON sr.user_role_id = r.id
    JOIN users u ON u.roleId = sr.admin_role_id
    JOIN tex_business_unit_user_types buut on buut.user_type_id = ut.id and r.business_unit_id = buut.business_unit_id
    JOIN tex_business_units bu on bu.id = buut.business_unit_id
  WHERE 1 = 1`;

  if (currentUser) {
    query += ` AND u.username = '${currentUser}' `;
  }

  if (queryObj.business_unit) {
    query += ` AND bu.business_unit = '${queryObj.business_unit}' `;
  };

  if (queryObj.roleId) {
    query += ` AND sr.admin_role_id = ${queryObj.roleId} `;
  };

  return query;
};

exports.fetchUserTypes = (paramObj, queryObj, currentUser) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    dbconnection.transaction((trx) => {
      transaction = trx;
      const userTypesQuery = getUserTypesQuery(queryObj, currentUser);
      return dbconnection.raw(userTypesQuery).transacting(transaction);
    })
      .then((userTypes) => {
        logger.info('roles fetched from service', userTypes);
        transaction.commit();
        resolve(userTypes[0]);
      })
      .catch((error) => {
        logger.info('error in fetch roles service', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
