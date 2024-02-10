const httpStatus = require('http-status');
const {
  Response,
  ErrorResponse
} = require('../../../utils/response');
const {
  logger
} = require('../../../utils/logger');
const tex = require('../../../services/tex');
const {
  errorMessage
} = require('../../../utils/common');

exports.createPostV2 = async (req, res) => {
  try {
    const post = await tex.createPostV2(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('Create Post Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createPost: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAllPostsV2 = async (req, res) => {
  try {
    const posts = await tex.getAllPostsV2(req.params)
    const jsonResponse = Response(httpStatus.OK, {
      posts
    });
    logger.info('Get Posts Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Posts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAllDefault = async (req, res) => {
  try {
    const posts = await tex.getAllPostsDefault()
    const jsonResponse = Response(httpStatus.OK, {
      posts
    });
    logger.info('Get Posts Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Posts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getPostById = async (req, res) => {
  try {
    const posts = await tex.getPostById(req.params.id)
    const jsonResponse = Response(httpStatus.OK, {
      posts
    });
    logger.info('Get Posts Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Posts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAllByArtistId = async (req,res) =>{
  try {
    const posts = await tex.getAllByArtistId(req.params)
    const jsonResponse = Response(httpStatus.OK, {
      posts
    });
    logger.info('Get Posts Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Posts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
}

exports.getAllOptions = async (req, res) => {
  try {
    const options = await tex.getAllOptions()
    const jsonResponse = Response(httpStatus.OK, {
      options
    });
    logger.info('Get All Options Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Posts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAllVotingResults = async (req, res) => {
  try {
    const options = await tex.getAllVotingResults()
    const jsonResponse = Response(httpStatus.OK, {
      options
    });
    logger.info('Get All Options Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Posts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.voteOption = async (req, res) => {
  try {
    const post = await tex.voteOption(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('voteOption Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.likeAPost = async (req, res) => {
  try {
    const post = await tex.likeAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('likeAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.unlikeAPost = async (req, res) => {
  try {
    const post = await tex.unlikeAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('unlikeAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.shareAPost = async (req, res) => {
  try {
    const post = await tex.shareAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('shareAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.unshareAPost = async (req, res) => {
  try {
    const post = await tex.unshareAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('unshareAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.saveAPost = async (req, res) => {
  try {
    const post = await tex.saveAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('saveAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.unsaveAPost = async (req, res) => {
  try {
    const post = await tex.unsaveAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('unsaveAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.reportAPost = async (req, res) => {
  try {
    const post = await tex.reportAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('reportAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.unreportAPost = async (req, res) => {
  try {
    const post = await tex.unreportAPost(req.body);
    const jsonResponse = Response(httpStatus.OK, post);
    logger.info('unreportAPost Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed voteOption: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.postReaction = async (req, res) => {
  try {
    const post = await tex.postReaction(req.params.id);
    const jsonResponse = Response(httpStatus.OK, { post: post.body.data });
    logger.info('Create postReaction Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed postReaction: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
