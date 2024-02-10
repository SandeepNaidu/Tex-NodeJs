const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { logger } = require('../../utils/logger');

exports.createPostVideo= (videoUrl, thumbUrl, caption, hashTag, latlong, address) => {
  return new Promise((resolve, reject) => {
      console.log("Calling createPostVideo.."+videoUrl, thumbUrl, caption, hashTag, latlong, address);
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({videoUrl, thumbUrl, caption, hashTag, latlong, address})
      .into('post_video')
      .then((success) => {
        console.log('post video created with Ids:--------', success[0]);
        const response = success[0];
        resolve(response);
      })
      .catch((error) => {
        console.log('Failed Post video Service: ', error);
        reject(null);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
