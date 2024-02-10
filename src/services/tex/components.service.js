const {
  // GetDBConnection: db,
  // GetDBDisconnection,
  GetSyncDBConnection,
  GetSyncDBDisconnection
} = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

exports.getComponents = () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .column({ label: 'name' }, { value: 'id' }, { status: 'status' })
      .select()
      .from('components')
      .then((success) => {
        logger.info('Get Components Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed GetComponents Service: ', error);
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

exports.createComponent = (name) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({ name })
      .into('components')
      .then((success) => {
        logger.info('Create Component Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Component has been successfully created'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Create Component Service: ', error);
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

exports.editComponent = (value, name) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('components')
      .update({ name: name })
      .where('id', value)
      .then((success) => {
        logger.info('Edit Component Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Component has been successfully edited'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Edit Component Service: ', error);
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
exports.updateComponentStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    // status = 0 inactive, 1 active
    const dbconnection = GetSyncDBConnection();
    dbconnection('components')
      .update({ status: status === 'true' ? 1 : 0 })
      .where('id', id)
      .then((success) => {
        logger.info('Update Component Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: `Component has been successfully ${
              status === 'true' ? 'activated' : 'deactivated'
            }`
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Update Component Service: ', error);
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
exports.getComponentsById = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .column({ label: 'name' }, { value: 'id' })
      .select()
      .from('components')
      .where({ id: id, status: 1 })
      .then((success) => {
        logger.info('Get Component ById Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Update Component Service: ', error);
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
