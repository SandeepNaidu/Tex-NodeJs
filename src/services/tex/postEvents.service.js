const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { logger } = require('../../utils/logger');
exports.createPostEvent= (eventImageUrl, eventType, eventFormat, event, eventExternalLink, description, hashTag, latlong, address) => {
  return new Promise((resolve, reject) => {
    console.log("Calling createPostEvent.."+eventImageUrl, eventType, eventFormat, event, eventExternalLink, description, hashTag, latlong, address);
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({eventImageUrl, eventType, eventFormat, event, eventExternalLink, description, hashTag, latlong, address})
      .into('post_event')
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
