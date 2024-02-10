const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { logger } = require('../../utils/logger');

exports.createPostDocument= (documentUrl, thumbUrl, caption, hashTag, latlong, address) => {
  return new Promise((resolve, reject) => {
      console.log("Calling createPostDocument.."+documentUrl, thumbUrl, caption, hashTag, latlong, address);
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({documentUrl, thumbUrl, caption, hashTag, latlong, address})
      .into('post_document')
      .then((success) => {
        console.log('post Document created with Ids:--------', success[0]);
        const response = success[0];
        resolve(response);
      })
      .catch((error) => {
        console.log('Failed Post Document Service: ', error);
        reject(null);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
