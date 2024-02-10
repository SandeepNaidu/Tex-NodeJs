const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { getCurrentUtcDatetime } = require('../../utils/common');
const { logger } = require('elastic-apm-node');
const auditLog = async (params) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    const date = getCurrentUtcDatetime(new Date());
    const logData = [
      {
        userId: params.userId,
        activity: params.activity,
        description: params.description,
        page: params.page,
        timestamp: date.timestamp,
        ipAddress: params.ipAddress,
        hostName: params.hostName
      }
    ];
    dbconnection('tex_audit_trail2')
      .insert(logData)
      .then((success) => {
        const response = {
          resultcode: successCode,
          body: success[0]
        };
        resolve(response);
      })
      .catch((error) => {
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

exports.auditLog = auditLog;

exports.addAuditLog = async (req) => {
  try {
    const clientIPAddress = req.headers['x-forwarded-for']
      ? req.headers['x-forwarded-for']
      : '127.0.0.0';
    req.query.ipAddress = clientIPAddress;
    req.query.hostName = clientIPAddress.split('.')[0];
    logger.info('logging record', req.query);
    const logrecord = await auditLog(req.query);
    logger.info('logged record', logrecord);
    return logrecord;
  } catch (error) {
    throw new Error(error);
  }
};
