const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');
const { createPostImage } = require('./postImages.service');
const { createPostVideo } = require('./postVideos.service');
const { createPostDocument } = require('./postDocuments.service');
const { createPostAudio } = require('./postAudios.service');
const { createPostEvent } = require('./postEvents.service');
const { createPostPoll } = require('./postPolls.service');

exports.createPost= (body) => {
  return new Promise((resolve, reject) => {
    let postTypeId = "";
    const {artistId, postType, imageUrl, thumbUrl,caption, hashTag, latlong, address,
      videoUrl,documentUrl,audioUrl,eventImageUrl, eventType, eventFormat, event,
      eventExternalLink, description,question, options, duration} = body;
    console.log("Creating popst for posttype: "+postType);
    switch (postType) {
    case "Image":
        console.log("Calling post type: Image");
        const postImage = createPostImage(imageUrl, thumbUrl,caption, hashTag, latlong, address);
          postImage.then((id) => {
          console.log("Generated post type: "+id);
          postTypeId = id;
          const dbconnection = GetSyncDBConnection();
          dbconnection
            .insert({artistId, postType, postTypeId})
            .into('tex_post')
            .then((success) => {
              logger.info('post created with Id:', success[0].id);
              const response = {
                resultcode: success[0].id,
                body: {
                  message: 'Post create created'
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.error('Failed Post create Service: ', error);
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
        break;
    case "Video":
        console.log("Calling post type: Video");
        const postVideo = createPostVideo(videoUrl, thumbUrl,caption, hashTag, latlong, address);
          postVideo.then((id) => {
          console.log("Generated post type: "+id);
          postTypeId = id;
          const dbconnection = GetSyncDBConnection();
          dbconnection
            .insert({artistId, postType, postTypeId})
            .into('tex_post')
            .then((success) => {
              logger.info('post created with Id:', success[0].id);
              const response = {
                resultcode: success[0].id,
                body: {
                  message: 'Post create created'
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.error('Failed Post create Service: ', error);
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
        break;
    case "Music":
        console.log("Calling post type: Music");
        const postAudio = createPostAudio(audioUrl, thumbUrl,caption, hashTag, latlong, address);
          postAudio.then((id) => {
          console.log("Generated post type: "+id);
          postTypeId = id;
          const dbconnection = GetSyncDBConnection();
          dbconnection
            .insert({artistId, postType, postTypeId})
            .into('tex_post')
            .then((success) => {
              logger.info('post created with Id:', success[0].id);
              const response = {
                resultcode: success[0].id,
                body: {
                  message: 'Post create created'
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.error('Failed Post create Service: ', error);
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
        break;
    case "Document":
        console.log("Calling post type: Document");
        const postDocument = createPostDocument(documentUrl, thumbUrl,caption, hashTag, latlong, address);
          postDocument.then((id) => {
          console.log("Generated post type: "+id);
          postTypeId = id;
          const dbconnection = GetSyncDBConnection();
          dbconnection
            .insert({artistId, postType, postTypeId})
            .into('tex_post')
            .then((success) => {
              logger.info('post created with Id:', success[0].id);
              const response = {
                resultcode: success[0].id,
                body: {
                  message: 'Post create created'
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.error('Failed Post create Service: ', error);
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
        break;
    case "Event":
        console.log("Calling post type: Event");
        const postEvent= createPostEvent(eventImageUrl, eventType, eventFormat, event, eventExternalLink, description, hashTag, latlong, address);
          postEvent.then((id) => {
          console.log("Generated post type: "+id);
          postTypeId = id;
          const dbconnection = GetSyncDBConnection();
          dbconnection
            .insert({artistId, postType, postTypeId})
            .into('tex_post')
            .then((success) => {
              logger.info('post created with Id:', success[0].id);
              const response = {
                resultcode: success[0].id,
                body: {
                  message: 'Post create created'
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.error('Failed Post create Service: ', error);
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
        break;
    case "Poll":
        console.log("Calling post type: Poll");
        const postPoll= createPostPoll(question, options, duration, hashTag, latlong, address);
          postPoll.then((id) => {
          console.log("Generated post type: "+id);
          postTypeId = id;
          const dbconnection = GetSyncDBConnection();
          dbconnection
            .insert({artistId, postType, postTypeId})
            .into('tex_post')
            .then((success) => {
              logger.info('post poll with Id:', success[0].id);
              const response = {
                resultcode: success[0].id,
                body: {
                  message: 'Post poll created'
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.error('Failed Post poll Service: ', error);
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
        break;
    default:
    const response = {
      resultcode: errorCode,
      body: {
        message: 'Invalid Posttype value'
      }
    };
    resolve(response);
    }

  });
};

exports.postSave = (artistId, postId, isSave) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    console.log("isSaved: ", isSave);
    if (isSave > 0) {
      dbconnection
        .insert({artistId,postId})
        .into('post_save_mapping')
        .then((success) => {
          logger.info('Create post save Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'post-save saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed post-save Service: ', error);
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
      dbconnection('post_save_mapping').del()
      .whereRaw('postId = ? and  artistId = ? ',[postId,artistId])
      .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Saved post removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed post-remove Service: ', error);
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

exports.postLike = (artistId, postId, isLike) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    console.log("isLiked: ", isLike);
    if (isLike > 0) {
      dbconnection
        .insert({artistId,postId})
        .into('post_like_mapping')
        .then((success) => {
          logger.info('Create post Like Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'post-Like saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed post-Like Service: ', error);
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
      dbconnection('post_like_mapping').del()
      .whereRaw('postId = ? and  artistId = ? ',[postId,artistId])
      .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Liked post removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed post-remove Service: ', error);
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

exports.postShare = (artistId, postId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      dbconnection
        .insert({artistId,postId})
        .into('post_share_mapping')
        .then((success) => {
          logger.info('Create post share Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'post-share saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed post-share Service: ', error);
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

exports.postReport = (artistId, postId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      dbconnection
        .insert({artistId,postId})
        .into('post_report_mapping')
        .then((success) => {
          logger.info('Create post report Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'post-report saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed post-report Service: ', error);
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

exports.postVote = (artistId, postId, voteOption) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      dbconnection
        .insert({artistId,postId,voteOption})
        .into('poll_vote')
        .then((success) => {
          logger.info('Create post vote Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'post-vote saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed post-vote Service: ', error);
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

exports.getPostsByArtistId = (id) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('tex_post')
      .join('users', 'users.id', 'tex_post.artistId')
      .join('post_image', 'post_image.postImageId', 'tex_post.postTypeId')
      .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
    'post_image.imageUrl','post_image.thumbUrl','post_image.caption','post_image.hashTag',
    'post_image.latlong','post_image.address','tex_post.createAt')
    .whereRaw("postType = 'Image' and artistId in (?)", [id])
      .then((postImage) => {
        dbconnection('tex_post')
          .join('users', 'users.id', 'tex_post.artistId')
          .join('post_video', 'post_video.postVideoId', 'tex_post.postTypeId')
          .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
        'post_video.videoUrl','post_video.thumbUrl','post_video.caption','post_video.hashTag',
        'post_video.latlong','post_video.address','tex_post.createAt')
        .whereRaw("postType = 'Video' and artistId in (?)", [id])
          .then((postVideo) => {
            dbconnection('tex_post')
              .join('users', 'users.id', 'tex_post.artistId')
              .join('post_audio', 'post_audio.postAudioId', 'tex_post.postTypeId')
              .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
            'post_audio.audioUrl','post_audio.thumbUrl','post_audio.caption','post_audio.hashTag',
            'post_audio.latlong','post_audio.address','tex_post.createAt')
            .whereRaw("postType = 'Music' and artistId in (?)", [id])
              .then((postAudio) => {
                dbconnection('tex_post')
                  .join('users', 'users.id', 'tex_post.artistId')
                  .join('post_document', 'post_document.postDocumentId', 'tex_post.postTypeId')
                  .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
                'post_document.documentUrl','post_document.thumbUrl','post_document.caption','post_document.hashTag',
                'post_document.latlong','post_document.address','tex_post.createAt')
                .whereRaw("postType = 'Document' and artistId in (?)", [id])
                  .then((postDocument) => {
                    dbconnection('tex_post')
                      .join('users', 'users.id', 'tex_post.artistId')
                      .join('post_event', 'post_event.postEventId', 'tex_post.postTypeId')
                      .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
                    'post_event.eventImageUrl','post_event.eventType','post_event.eventFormat','post_event.event',
                  'post_event.eventExternalLink','post_event.description','post_event.hashTag',
                    'post_event.latlong','post_event.address','tex_post.createAt')
                    .whereRaw("postType = 'Event' and artistId in (?)", [id])
                      .then((postEvent) => {
                        dbconnection('tex_post')
                          .join('users', 'users.id', 'tex_post.artistId')
                          .join('post_poll', 'post_poll.postPollId', 'tex_post.postTypeId')
                          .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
                        'post_poll.question','post_poll.options','post_poll.duration','post_poll.hashTag',
                        'post_poll.latlong','post_poll.address','tex_post.createAt')
                        .whereRaw("postType = 'Poll' and artistId in (?)", [id])
                          .then((postPoll) => {
                            const response = {
                            resultcode: successCode,
                            body: {
                                Image: postImage,
                                Video: postVideo,
                                Music: postAudio,
                                Document: postDocument,
                                Event: postEvent,
                                Poll: postPoll
                                }
                              };
                            resolve(response);
                          })
                          .catch((error) => {
                            logger.error('Failed getPostsByArtistId Service: ', error);
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
                  });
              });
          });
      });
  });
};

exports.getAllPosts = () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('tex_post')
      .join('users', 'users.id', 'tex_post.artistId')
      .join('post_image', 'post_image.postImageId', 'tex_post.postTypeId')
      .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
    'post_image.imageUrl','post_image.thumbUrl','post_image.caption','post_image.hashTag',
    'post_image.latlong','post_image.address','tex_post.createAt')
    .whereRaw("postType = 'Image'")
      .then((postImage) => {
        dbconnection('tex_post')
          .join('users', 'users.id', 'tex_post.artistId')
          .join('post_video', 'post_video.postVideoId', 'tex_post.postTypeId')
          .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
        'post_video.videoUrl','post_video.thumbUrl','post_video.caption','post_video.hashTag',
        'post_video.latlong','post_video.address','tex_post.createAt')
        .whereRaw("postType = 'Video'")
          .then((postVideo) => {
            dbconnection('tex_post')
              .join('users', 'users.id', 'tex_post.artistId')
              .join('post_audio', 'post_audio.postAudioId', 'tex_post.postTypeId')
              .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
            'post_audio.audioUrl','post_audio.thumbUrl','post_audio.caption','post_audio.hashTag',
            'post_audio.latlong','post_audio.address','tex_post.createAt')
            .whereRaw("postType = 'Music'")
              .then((postAudio) => {
                dbconnection('tex_post')
                  .join('users', 'users.id', 'tex_post.artistId')
                  .join('post_document', 'post_document.postDocumentId', 'tex_post.postTypeId')
                  .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
                'post_document.documentUrl','post_document.thumbUrl','post_document.caption','post_document.hashTag',
                'post_document.latlong','post_document.address','tex_post.createAt')
                .whereRaw("postType = 'Document' ")
                  .then((postDocument) => {
                    dbconnection('tex_post')
                      .join('users', 'users.id', 'tex_post.artistId')
                      .join('post_event', 'post_event.postEventId', 'tex_post.postTypeId')
                      .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
                    'post_event.eventImageUrl','post_event.eventType','post_event.eventFormat','post_event.event',
                  'post_event.eventExternalLink','post_event.description','post_event.hashTag',
                    'post_event.latlong','post_event.address','tex_post.createAt')
                    .whereRaw("postType = 'Event'")
                      .then((postEvent) => {
                        dbconnection('tex_post')
                          .join('users', 'users.id', 'tex_post.artistId')
                          .join('post_poll', 'post_poll.postPollId', 'tex_post.postTypeId')
                          .select('tex_post.id', 'users.firstName AS artistFirstName', 'users.lastName AS artistLastName',
                        'post_poll.question','post_poll.options','post_poll.duration','post_poll.hashTag',
                        'post_poll.latlong','post_poll.address','tex_post.createAt')
                        .whereRaw("postType = 'Poll'")
                          .then((postPoll) => {
                            const response = {
                            resultcode: successCode,
                            body: {
                                Image: postImage,
                                Video: postVideo,
                                Music: postAudio,
                                Document: postDocument,
                                Event: postEvent,
                                Poll: postPoll
                                }
                              };
                            resolve(response);
                          })
                          .catch((error) => {
                            logger.error('Failed getAllPosts Service: ', error);
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
                  });
              });
          });
      });
  });
};
