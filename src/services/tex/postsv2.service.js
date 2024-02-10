const {
    GetSyncDBConnection,
    GetSyncDBDisconnection
} = require('../db');
const {
    successCode,
    errorCode
} = require('../../config/vars');
const {
    logger
} = require('../../utils/logger');

const moment = require("moment")

const customQueries = (postType) => {
    return `
SELECT
  post.*,
  users.firstName,
  users.lastName,
  COUNT(post_like_mapping.postId) AS like_count,
  COUNT(post_save_mapping.postId) AS save_count,
  COUNT(post_share_mapping.postId) AS share_count
FROM
  post
  JOIN users ON post.artistId = users.id
  LEFT JOIN post_like_mapping ON post.id = post_like_mapping.postId
  LEFT JOIN post_save_mapping ON post.id = post_save_mapping.postId
  LEFT JOIN post_share_mapping ON post.id = post_share_mapping.postId
WHERE
  post.postType = '${postType}'
GROUP BY
  post.id;
`
}

const returnAllwithlikedSavedShared = (postType,userId) => {
    return `
SELECT
  post.*,
  users.firstName,
  users.lastName,
  users.id as artistId,
  users.profileImage AS artistProfileImage,
  IF(post_like_mapping.artistId = ${userId}, 1, 0) AS is_liked,
  IF(post_save_mapping.artistId = ${userId}, 1, 0) AS is_saved,
  IF(post_share_mapping.artistId = ${userId}, 1, 0) AS is_shared,
  IF(poll_voting.artistId = ${userId}, 1, 0) AS is_voted,
  IF(post_report_mapping.artistId = ${userId}, 1, 0) AS is_reported,
  COUNT(post_like_mapping.id) AS like_count,
  COUNT(post_save_mapping.id) AS save_count,
  COUNT(post_share_mapping.id) AS share_count,
  COUNT(post_report_mapping.id) AS report_count
FROM
  post
  JOIN users ON post.artistId = users.id
  LEFT JOIN post_report_mapping ON post.id = post_report_mapping.postId
  LEFT JOIN post_like_mapping ON post.id = post_like_mapping.postId
  LEFT JOIN poll_voting ON post.id = poll_voting.postId
  LEFT JOIN post_save_mapping ON post.id = post_save_mapping.postId
  LEFT JOIN post_share_mapping ON post.id = post_share_mapping.postId
WHERE
  post.postType = '${postType}'
GROUP BY
  post.id;
`
}

const allPostsSavedQueries = (postType,userId) => {
    return `
    SELECT
        post.*,
        users.firstName,
        users.lastName,
        users.id as artistId,
        users.profileImage AS artistProfileImage,
        IF(post_like_mapping.artistId = ${userId}, 1, 0) AS is_liked,
        IF(post_save_mapping.artistId = ${userId}, 1, 0) AS is_saved,
        IF(post_share_mapping.artistId = ${userId}, 1, 0) AS is_shared,
        IF(poll_voting.artistId = ${userId}, 1, 0) AS is_voted,
        IF(post_report_mapping.artistId = ${userId}, 1, 0) AS is_reported,
        COUNT(post_like_mapping.id) AS like_count,
        COUNT(post_save_mapping.id) AS save_count,
        COUNT(post_share_mapping.id) AS share_count,
        COUNT(post_report_mapping.id) AS report_count
        FROM
        post
        JOIN users ON post.artistId = users.id
        LEFT JOIN post_report_mapping ON post.id = post_report_mapping.postId
        LEFT JOIN post_like_mapping ON post.id = post_like_mapping.postId
        LEFT JOIN poll_voting ON post.id = poll_voting.postId
        LEFT JOIN post_save_mapping ON post.id = post_save_mapping.postId
        LEFT JOIN post_share_mapping ON post.id = post_share_mapping.postId
        WHERE
            post_save_mapping.artistId = '${userId}' AND post.postType = '${postType}'
        GROUP BY
        post.id;
        `
}

const getVotingCount = (post_id) => {
    return `
    SELECT poll_option.id,optionText, COUNT(poll_voting.optionId) AS count
    FROM poll_option
    LEFT JOIN poll_voting ON poll_option.id = poll_voting.optionId
    INNER JOIN post ON poll_option.postId = post.id
    WHERE post.id = '${post_id}'
    GROUP BY poll_option.id, optionText
    ORDER BY poll_option.id;
`}

exports.createPostV2 = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        if (newPosts.postType !== "Poll") {
            await dbconnection("post").insert({
                ...newPosts,
                createAt:moment().unix()
            })
            delete newPosts.options;
            const response = {
                resultcode: successCode,
                body: {
                    message: `Post ${newPosts.postType} has been successfully created!`
                }
            };
            await GetSyncDBDisconnection(dbconnection);
            return response
        } else {
            const options = newPosts.options
            const post = await dbconnection("post").insert({
                ...newPosts,
                createAt:moment().unix(),
                options: null
            }).then((success) => {
                return success[0]
            })
            await Promise.all(
                options.map(async (option) => {
                    await dbconnection("poll_option").insert({
                        postId: post,
                        optionText: option
                    })
                })
            )
            const response = {
                resultcode: successCode,
                body: {
                    message: `Post ${newPosts.postType} has been successfully created!`
                }
            };
            await GetSyncDBDisconnection(dbconnection);
            return response
        }
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.getAllOptions = async () => {
    try {
        const dbconnection = await GetSyncDBConnection();
        const polls = await dbconnection.raw('SELECT * FROM poll_option').then((success) => {
            logger.info('Get all Poll:', success);
            return success[0]
        })
        const response = {
            resultcode: successCode,
            body: polls
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        return err
    }
};

exports.getAllPostsV2 = async (body) => {
    try {
        let userId = body.userId
        const dbconnection = await GetSyncDBConnection();
        const polls = await dbconnection.raw(returnAllwithlikedSavedShared('Poll',userId)).then((success) => {
            return success[0]
        })
        const videos = await dbconnection.raw(returnAllwithlikedSavedShared('Video',userId)).then((success) => {
            return success[0]
        })
        const musics = await dbconnection.raw(returnAllwithlikedSavedShared('Music',userId)).then((success) => {
            return success[0]
        })
        const documents = await dbconnection.raw(returnAllwithlikedSavedShared('Document',userId)).then((success) => {
            return success[0]
        })
        const images = await dbconnection.raw(returnAllwithlikedSavedShared('Image',userId)).then((success) => {
            return success[0]
        })
        const events = await dbconnection.raw(returnAllwithlikedSavedShared('Event',userId)).then((success) => {
            return success[0]
        })
        let finalPolls = []
        await Promise.all(
            polls.map(async (poll) => {
                let options = {}
                options = await dbconnection.raw(getVotingCount(poll.id)).then((success) => {return success[0]})
                finalPolls.push({
                    ...poll,
                    option:options
                })
            })
        )
        const response = {
            resultcode: "200",
            body: {
                data: {
                    polls:finalPolls,
                    videos,
                    documents,
                    images,
                    musics,
                    events
                }
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.getAllByArtistId = async (body) => {
    try {
        const dbconnection = await GetSyncDBConnection();
        const polls = await dbconnection.raw(allPostsSavedQueries('Poll',body.artistId)).then((success) => {
            return success[0]
        })
        const videos = await dbconnection.raw(allPostsSavedQueries('Video',body.artistId)).then((success) => {
            return success[0]
        })
        const musics = await dbconnection.raw(allPostsSavedQueries('Music',body.artistId)).then((success) => {
            return success[0]
        })
        const documents = await dbconnection.raw(allPostsSavedQueries('Document',body.artistId)).then((success) => {
            return success[0]
        })
        const images = await dbconnection.raw(allPostsSavedQueries('Image',body.artistId)).then((success) => {
            return success[0]
        })
        const events = await dbconnection.raw(allPostsSavedQueries('Event',body.artistId)).then((success) => {
            return success[0]
        })
        let finalPolls = []
        await Promise.all(
            polls.map(async (poll) => {
                let options = {}
                options = await dbconnection.raw(getVotingCount(poll.id)).then((success) => {return success[0]})
                finalPolls.push({
                    ...poll,
                    option:options
                })
            })
        )
        const response = {
            resultcode: "200",
            body: {
                data: {
                    polls:finalPolls,
                    videos,
                    documents,
                    images,
                    musics,
                    events
                }
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.getAllPostsDefault = async () => {
    try {
        const dbconnection = await GetSyncDBConnection();
        const posts = await dbconnection.raw('SELECT * FROM post').then((success) => {
            logger.info('Get all Poll:', success);
            return success[0]
        })
        const response = {
            resultcode: successCode,
            body: {
                data: posts
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        return err
    }
};

exports.getPostById = async (id) => {
    try {
        const dbconnection = await GetSyncDBConnection();
        const posts = await dbconnection.raw(`SELECT * FROM post WHERE id = ${id}`).then((success) => {
            logger.info('Get Post By Id:', success);
            return success[0]
        })
        const response = {
            resultcode: successCode,
            body: {
                data: posts
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        return err
    }
};

exports.voteOption = async (votedOption) => {
    try {
        const dbconnection = await GetSyncDBConnection();
        await dbconnection("poll_voting").insert(votedOption).then((success) => {
            return success[0]
        })
        const response = {
            resultcode: successCode,
            body: {
                message: `You voted for ${votedOption.optionId}`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.getAllVotingResults = async () => {
    try {
        const dbconnection = await GetSyncDBConnection();
        const polls = await dbconnection.raw('SELECT * FROM poll_voting').then((success) => {
            logger.info('Get all voting:', success);
            return success[0]
        })
        const response = {
            resultcode: successCode,
            body: polls
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.likeAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection("post_like_mapping").insert(newPosts)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been liked!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.saveAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection("post_save_mapping").insert(newPosts)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been saved!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.shareAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection("post_share_mapping").insert(newPosts)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been saved!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.reportAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection("post_report_mapping").insert(newPosts)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been reported!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.unlikeAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection.raw(`DELETE FROM post_like_mapping WHERE artistId=${newPosts.artistId} AND postId=${newPosts.postId}`)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been unliked!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.unsaveAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection.raw(`DELETE FROM post_save_mapping WHERE artistId=${newPosts.artistId} AND postId=${newPosts.postId}`)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been unsaved!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.unshareAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection.raw(`DELETE FROM post_share_mapping WHERE artistId=${newPosts.artistId} AND postId=${newPosts.postId}`)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been unshare!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.unreportAPost = async (newPosts) => {
    try {
        const dbconnection = GetSyncDBConnection();
        await dbconnection.raw(`DELETE FROM post_report_mapping WHERE artistId=${newPosts.artistId} AND postId=${newPosts.postId}`)
        const response = {
            resultcode: successCode,
            body: {
                message: `Post has been unreport!`
            }
        };
        await GetSyncDBDisconnection(dbconnection);
        return response
    } catch (err) {
        console.log(err)
        return err
    }
};

exports.postReaction = (artistId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      console.log("postReaction count..");
      dbconnection
        .raw(`SELECT (SELECT COUNT(*) from post_like_mapping where artistId=${artistId} ) + (SELECT COUNT(*) as shareCount from post_share_mapping where artistId=${artistId} ) + (SELECT COUNT(*) as saveCount from post_save_mapping where artistId=${artistId} ) AS reactionCount, 0 as searchCount FROM DUAL;`)
        .then((success) => {
          logger.info('postReaction save Response-------------:', success);
          const response = {
            resultcode: successCode,
            body: {
              data: success[0]
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed postReaction Service: ', error);
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
