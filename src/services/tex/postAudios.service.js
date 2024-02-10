const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { logger } = require('../../utils/logger');

exports.createPostAudio= (audioUrl, thumbUrl, caption, hashTag, latlong, address) => {
  return new Promise((resolve, reject) => {
      console.log("Calling createPostAudio.."+audioUrl, thumbUrl, caption, hashTag, latlong, address);
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({audioUrl, thumbUrl, caption, hashTag, latlong, address})
      .into('post_audio')
      .then((success) => {
        console.log('post Audio created with Ids:--------', success[0]);
        const response = success[0];
        resolve(response);
      })
      .catch((error) => {
        console.log('Failed Post Audio Service: ', error);
        reject(null);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
