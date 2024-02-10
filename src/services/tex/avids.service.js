const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

exports.createAvid = (artistId, content, coverContent, title, caption, hashTag, mode) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({artistId, content, coverContent, title, caption, hashTag, mode})
      .into('tex_avid')
      .then((success) => {
        logger.info('Create Avid Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Avid has been successfully created'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Create Avid Service: ', error);
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

exports.getAvidsById = (id, artistId) => {
  console.log("id::::::"+id);
  console.log("artistId::::::"+artistId);
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('tex_avid')
      .join('users', 'users.id', 'tex_avid.artistId')
      .select('tex_avid.avidId', 'tex_avid.artistId', 'tex_avid.content','tex_avid.coverContent',
      'tex_avid.title', 'tex_avid.caption','tex_avid.hashTag', 'tex_avid.mode',
      'tex_avid.createAt', 'tex_avid.updateAt', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName')
      .whereRaw('avidId = ?', id)
      .then((success) => {
        if (success.length !== 0) {
          // Get Like count
          dbconnection('avid_like_mapping').count('id').where('avidId', id).then((likeCount) => {
             success[0].likeCount = likeCount[0]['count(`id`)'];
             dbconnection('avid_share_mapping').count('id').where('avidId', id).then((shareCount) => {
                success[0].shareCount = shareCount[0]['count(`id`)'];
                dbconnection('avid_save_mapping').count('id').where('avidId', id).then((saveCount) => {
                   success[0].saveCount = saveCount[0]['count(`id`)'];
                   dbconnection('avid_like_mapping').count('id').whereRaw('avidId = ? and  artistId = ? ',[id,artistId]).then((isLiked) => {
                      success[0].isLiked = isLiked[0]['count(`id`)'] > 0 ? 1 : 0;
                      dbconnection('avid_save_mapping').count('id').whereRaw('avidId = ? and  artistId = ? ',[id,artistId]).then((isSaved) => {
                        success[0].isSaved = isSaved[0]['count(`id`)'] > 0 ? 1 : 0;
                        dbconnection('avid_share_mapping').count('id').whereRaw('avidId = ? and  artistId = ? ',[id,artistId]).then((isShared) => {
                          success[0].isShared = isShared[0]['count(`id`)'] > 0 ? 1 : 0;
                        dbconnection
                          .column({ label: 'name' }, { value: 'id' })
                          .select()
                          .from('avid_tag')
                          .whereRaw('isActive = 1 and id in (?)', [success[0]['hashTag'].split(',')])
                          .then((tags) => {
                            success[0].tags = tags;
                            const response = {
                              resultcode: successCode,
                              body: {
                                data: success
                              }
                            };
                            resolve(response);
                          })
                          .catch((error) => {
                            logger.error('Failed avid save Service: ', error);
                            const response = {
                              resultcode: errorCode,
                              body: {
                                data: error
                              }
                            };
                            reject(response);
                          }).finally(() => {
                            GetSyncDBDisconnection(dbconnection);
                          });
                      });
                      });
                    });
                 });
              })
              .catch((error) => {
                logger.error('Failed avid share Service: ', error);
                const response = {
                  resultcode: errorCode,
                  body: {
                    data: error
                  }
                };
                reject(response);
              });
           })
      } else {
          const response = {
            resultcode: successCode,
            body: {
              data: success
            }
          };
          resolve(response);
      }
    });
  });
};

exports.getAvidsByArtistId = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('tex_avid')
      .join('users', 'users.id', 'tex_avid.artistId')
      .select('tex_avid.avidId', 'tex_avid.artistId', 'tex_avid.content','tex_avid.coverContent',
      'tex_avid.title', 'tex_avid.caption','tex_avid.hashTag', 'tex_avid.mode',
      'tex_avid.createAt', 'tex_avid.updateAt', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName')
      .where({ artistId: id })
      .then((success) => {
        logger.info('Get AvidsByArtistId Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed getAvidsByArtistId Service: ', error);
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

exports.getAllAvids = (mode) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('tex_avid')
      .join('users', 'users.id', 'tex_avid.artistId')
      .select('tex_avid.avidId', 'tex_avid.artistId', 'tex_avid.content','tex_avid.coverContent',
      'tex_avid.title', 'tex_avid.caption','tex_avid.hashTag', 'tex_avid.mode',
      'tex_avid.createAt', 'tex_avid.updateAt', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName')
      .whereRaw('LOWER(mode) LIKE LOWER(?)', [mode])
      .then((success) => {
        logger.info('Get AllAvids Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed getAllAvids Service: ', error);
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

exports.editAvidById = (id, body) => {
  return new Promise((resolve, reject) => {
    const { content, coverContent, title, caption, hashTag, mode } = body;
    const dbconnection = GetSyncDBConnection();
    dbconnection('tex_avid')
      .update({content, coverContent, title, caption, hashTag, mode})
      .where('avidId', id)
      .then((success) => {
        logger.info('Update Avid Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Avid has been successfully updated'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed update Avid Service: ', error);
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

exports.avidShare = (artistId, avidId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({artistId, avidId})
      .into('avid_share_mapping')
      .then((success) => {
        logger.info('Create Avid-share Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Avid-share saved!!'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Avid-share Service: ', error);
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

exports.avidLike = (artistId, avidId, islike) => {
  return new Promise((resolve, reject) => {
    console.log("islike: ", islike);
    const dbconnection = GetSyncDBConnection();
    if (islike > 0) {
      console.log("Saving avid like");
      dbconnection
        .insert({artistId, avidId})
        .into('avid_like_mapping')
        .then((success) => {
          logger.info('Create Avid-like Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'Avid-like saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed Avid-like Service: ', error);
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
    } else {
      console.log("Removing avid like");
      dbconnection('avid_like_mapping').del()
      .whereRaw('avidId = ? and  artistId = ? ',[avidId,artistId])
        .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Avid-like Removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed Avid-like remove Service: ', error);
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
    }


  });
};

exports.avidSave = (artistId, avidId, isSave) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    console.log("isSaved: ", isSave);
    if (isSave > 0) {
      console.log("Saving avid saveTag");
      dbconnection
        .insert({artistId, avidId})
        .into('avid_save_mapping')
        .then((success) => {
          logger.info('Create Avid save Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'Avid-save saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed Avid-save Service: ', error);
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
    } else {
      console.log("Removing avid saveTag");
      dbconnection('avid_save_mapping').del()
      .whereRaw('avidId = ? and  artistId = ? ',[avidId,artistId])
      .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Saved Avid removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed Avid-remove Service: ', error);
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
    }
  });
};
