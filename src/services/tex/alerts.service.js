const {
  // GetDBConnection: db,
  // GetDBDisconnection,
  GetSyncDBConnection,
  GetSyncDBDisconnection
} = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

exports.getAlerts = () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .select()
      .from('wld_alert')
      .then((success) => {
        logger.info('Get Alerts Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed getAlerts Service: ', error);
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

exports.createAlert = (data) => {
  return new Promise((resolve, reject) => {
    const { alertMessage, priority, isActive, check, rag } = data;
    const dbconnection = GetSyncDBConnection();
    const insertAlertObj = {
      ALERT_MSG: alertMessage,
      PRIORITY: priority,
      ISACTIVE: isActive,
      CHECK: check,
      RAG: rag
    };
    dbconnection
      .insert(insertAlertObj)
      .into('wld_alert')
      .then((success) => {
        logger.info('Create Alert Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Alert has been successfully created'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Create Alert Service: ', error);
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

exports.editAlert = (value, data) => {
  return new Promise((resolve, reject) => {
    const { alertMessage, priority, isActive, check, rag } = data;
    const dbconnection = GetSyncDBConnection();
    const updateAlertObj = {
      ALERT_MSG: alertMessage,
      PRIORITY: priority,
      ISACTIVE: isActive,
      CHECK: check,
      RAG: rag
    };
    dbconnection('wld_alert')
      .update(updateAlertObj)
      .where('ALERT_ID', value)
      .then((success) => {
        logger.info('Edit Alert Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Alert has been successfully edited'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Edit Alert Service: ', error);
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

exports.deleteAlert = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('wld_alert')
      .where('ALERT_ID', id)
      .del()
      .then((success) => {
        logger.info('Delete Alert Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Alert has been successfully deleted'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Delete Alert Service: ', error);
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

exports.getActiveAlerts = () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .select()
      .from('wld_alert')
      .where({ ISACTIVE: 1 })
      .orderBy('PRIORITY')
      .then((success) => {
        logger.info('Get Active Alerts Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed getActiveAlerts Service: ', error);
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
