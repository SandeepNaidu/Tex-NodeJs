const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { logger } = require('../../utils/logger');

exports.createPostPoll= (question, options, duration, hashTag, latlong, address) => {
  return new Promise((resolve, reject) => {
    console.log("Calling createPostEvent.."+question, options, duration, hashTag, latlong, address);
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({question, options, duration, hashTag, latlong, address})
      .into('post_poll')
      .then((success) => {
        console.log('post Event created with Ids:--------', success[0]);
        const response = success[0];
        resolve(response);
      })
      .catch((error) => {
        console.log('Failed Post Event Service: ', error);
        reject(null);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
