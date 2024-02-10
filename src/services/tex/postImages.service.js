const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { logger } = require('../../utils/logger');

exports.createPostImage= (imageUrl, thumbUrl, caption, hashTag, latlong, address) => {
  return new Promise((resolve, reject) => {
      console.log("Calling createPostImage.."+imageUrl, thumbUrl, caption, hashTag, latlong, address);
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({imageUrl, thumbUrl, caption, hashTag, latlong, address})
      .into('post_image')
      .then((success) => {
        console.log('post image created with Ids:--------', success[0]);
        const response = success[0];
        resolve(response);
      })
      .catch((error) => {
        console.log('Failed Post image Service: ', error);
        reject(null);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
