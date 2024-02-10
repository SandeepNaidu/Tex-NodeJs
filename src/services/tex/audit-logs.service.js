const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');
const { listUsers } = require('./user.service');

exports.getAuditLogs = async (userNameAndRole, startDate, endDate, params) => {
  logger.info('username  ', userNameAndRole);
  const users = await listUsers({
    params: {},
    query: {}
  }, userNameAndRole.username);
  return new Promise((resolve, reject) => {
    // try {
    // return userNameAndRole.roleType === 'superadmin' && params.pagination
    //   ? await getAllUsersLogPage(startDate, endDate, params)
    //   : userNameAndRole.roleType === 'superadmin'
    //     ? await getAllUsersLog(startDate, endDate)
    //     : userNameAndRole.roleType === 'dca-astro-admin'
    //       ? await getDcaLog(startDate, endDate)
    //       : userNameAndRole.roleType === 'dca-agency'
    //         ? await getDcaAgencyLog(startDate, endDate, userNameAndRole)
    //         : await getUserLog(userNameAndRole, startDate, endDate);

    logger.info('users details', users);
    const usernames = [];
    for (const [key, value] of Object.entries(users)) {
      logger.info(`${key}: ${value}`);
      usernames.push(value.username);
    }
    logger.info(`usernames from users Table${usernames}`);

    const { today, week } = getDateRange(startDate, endDate);
    const dbconnection = GetSyncDBConnection();
    dbconnection.select('tex_audit_trail2.*', 'tex_agencies.agencyCode')
      .from('tex_audit_trail2')
      .where('timestamp', '<=', today)
      .where('timestamp', '>=', week)
      .orderBy('tex_audit_trail2.id', 'desc')
      .innerJoin('users', 'users.username', 'tex_audit_trail2.userId')
      .leftJoin('tex_agencies', 'tex_agencies.id', 'users.agencyId')
      .whereIn('username', usernames)
      .then((result) => {
        const response = {
          resultCode: successCode,
          body: {
            data: result
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed AuditLogs Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

const getDateRange = (startDate, endDate) => {
  let today, week;
  if (startDate && endDate) {
    today = new Date(endDate);
    week = new Date(startDate);
  } else {
    today = new Date();
    week = new Date(today);
    week.setDate(week.getDate() - 1);
  }
  return { today, week };
};
