const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');
// const { uploadFileToS3Bucket } = require('../aws/s3fileupload.service');

exports.createTag = (name) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    const isActive = 1;
    dbconnection
      .insert({name, isActive})
      .into('avid_tag')
      .then((success) => {
        logger.info('Create AvidTag Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'AvidTag has been successfully created'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Create AvidTag Service: ', error);
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

exports.getTagsById = (ids) => {
  var array = ids.split(',');
  console.log("id::::::"+array);
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    // dbconnection.raw('select id, name from avid_tag where id in (?)', id)
    dbconnection
      .column({ label: 'name' }, { value: 'id' })
      .select()
      .from('avid_tag')
      .whereRaw('isActive = 1 and id in (?)', [array])
      .then((success) => {
        logger.info('Get Tag ById Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Tag ById Service: ', error);
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

exports.getTagsByName = (name) => {
  console.log("id::::::"+name);
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    // dbconnection.raw('select id, name from avid_tag where id in (?)', id)
    dbconnection
      .column({ label: 'name' }, { value: 'id' })
      .select()
      .from('avid_tag')
      .whereRaw('isActive = 1 and LOWER(name) LIKE LOWER(?)', [`%${name}%`])
      .then((success) => {
        logger.info('Get Tag ById Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Tag ById Service: ', error);
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


exports.getAllTags = () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .column({ label: 'name' }, { value: 'id' }, {isActive: 'isActive'})
      .select()
      .from('avid_tag')
      .then(async (success) => {
        logger.info('Get All Tag Service Response:', success);
        // uploadFileToS3Bucket();
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed All Tag Service: ', error);
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

exports.deleteTagsById = (ids) => {
  var array = ids.split(',');
  console.log("id::::::"+array);
  return new Promise((resolve, reject) => {
    const isActive = 0;
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .update({isActive})
      .from('avid_tag')
      .whereRaw('isActive = 1 and id in (?)', [array])
      .then((success) => {
        logger.info('delete Tag ById Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed delete Tag ById Service: ', error);
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


exports.editTagsById = (ids, name) => {
  var array = ids.split(',');
  console.log("id::::::"+array);
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .update({name})
      .from('avid_tag')
      .whereRaw('isActive = 1 and id in (?)', [array])
      .then((success) => {
        logger.info('edit Tag ById Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed edit Tag ById Service: ', error);
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
