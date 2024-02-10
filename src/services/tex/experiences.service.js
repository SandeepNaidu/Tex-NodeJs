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
  COUNT(DISTINCT post_like_mapping.postId) AS like_count, 
  COUNT(DISTINCT post_save_mapping.postId) AS save_count, 
  COUNT(DISTINCT post_share_mapping.postId) AS share_count
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

const allPostsSavedQueries = (postType,userId) => {
    return `
SELECT 
  post.*, 
  users.firstName, 
  users.lastName, 
  COUNT(DISTINCT post_like_mapping.postId) AS like_count, 
  COUNT(DISTINCT post_save_mapping.postId) AS save_count, 
  COUNT(DISTINCT post_share_mapping.postId) AS share_count
FROM 
  post 
  JOIN users ON post.artistId = users.id 
  LEFT JOIN post_like_mapping ON post.id = post_like_mapping.postId 
  LEFT JOIN post_save_mapping ON post.id = post_save_mapping.postId 
  LEFT JOIN post_share_mapping ON post.id = post_share_mapping.postId 
WHERE
  post.postType = '${postType}' AND post.userId = '${userId}'
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

exports.getAllPostsV2 = async () => {
    try {
        const dbconnection = await GetSyncDBConnection();
        const polls = await dbconnection.raw(customQueries('Poll')).then((success) => {
            return success[0]
        })
        const videos = await dbconnection.raw(customQueries('Video')).then((success) => {
            return success[0]
        })
        const musics = await dbconnection.raw(customQueries('Music')).then((success) => {
            return success[0]
        })
        const documents = await dbconnection.raw(customQueries('Document')).then((success) => {
            return success[0]
        })
        const images = await dbconnection.raw(customQueries('Image')).then((success) => {
            return success[0]
        })
        const events = await dbconnection.raw(customQueries('Event')).then((success) => {
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

exports.getAllPostsSavedV2 = async (artistId) => {
    try {
        const dbconnection = await GetSyncDBConnection();
        const polls = await dbconnection.raw(allPostsSavedQueries('Poll',artistId)).then((success) => {
            return success[0]
        })
        const videos = await dbconnection.raw(allPostsSavedQueries('Video',artistId)).then((success) => {
            return success[0]
        })
        const musics = await dbconnection.raw(allPostsSavedQueries('Music',artistId)).then((success) => {
            return success[0]
        })
        const documents = await dbconnection.raw(allPostsSavedQueries('Document',artistId)).then((success) => {
            return success[0]
        })
        const images = await dbconnection.raw(allPostsSavedQueries('Image',artistId)).then((success) => {
            return success[0]
        })
        const events = await dbconnection.raw(allPostsSavedQueries('Event')).then((success) => {
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