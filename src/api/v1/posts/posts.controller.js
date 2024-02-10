const httpStatus = require('http-status');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

exports.createPost = async (req, res) => {
  try {
    console.log('Create posts Controller Request:', req.body.data);
    const posts = await tex.createPost(req.body.data);
    const jsonResponse = Response(httpStatus.OK, { posts });
    logger.info('Create posts Controller Response:', jsonResponse);
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

exports.postSave = async (req, res) => {
  try {
    const { artistId, postId, isSave} = req.body.data;
    logger.info('Create postSave Controller Request:', artistId, postId, isSave );
    const post = await tex.postSave(artistId, postId, isSave);
    const jsonResponse = Response(httpStatus.OK, { post });
    logger.info('Create postSave Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed postSave: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.postLike = async (req, res) => {
  try {
    const { artistId, postId, isLike} = req.body.data;
    logger.info('Create postSave Controller Request:', artistId, postId, isLike );
    const post = await tex.postLike(artistId, postId, isLike);
    const jsonResponse = Response(httpStatus.OK, { post });
    logger.info('Create postLike Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed postLike: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.postShare = async (req, res) => {
  try {
    const { artistId, postId} = req.body.data;
    logger.info('Create postSave Controller Request:', artistId, postId );
    const post = await tex.postShare(artistId, postId);
    const jsonResponse = Response(httpStatus.OK, { post });
    logger.info('Create postShare Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed postShare: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.postReport = async (req, res) => {
  try {
    const { artistId, postId} = req.body.data;
    logger.info('Create postSave Controller Request:', artistId, postId );
    const post = await tex.postReport(artistId, postId);
    const jsonResponse = Response(httpStatus.OK, { post });
    logger.info('Create postReport Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed postReport: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.postVote= async (req, res) => {
  try {
    const { artistId, postId,voteOption} = req.body.data;
    logger.info('Create postVote Controller Request:', artistId, postId,voteOption );
    const post = await tex.postVote(artistId, postId,voteOption);
    const jsonResponse = Response(httpStatus.OK, { post });
    logger.info('Create postVote Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed postVote: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getPostsByArtistId = async (req, res) => {
  try {
    logger.info('Get getPostsByArtistId Controller Request:', req.params.id);
    const posts = await tex.getPostsByArtistId(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      posts: posts.body
    });
    logger.info('Get getPostsByArtistId Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getPostsByArtistId: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    logger.info('Get getAllPosts Controller');
    const posts = await tex.getAllPosts();
    const jsonResponse = Response(httpStatus.OK, {
      posts: posts.body
    });
    logger.info('Get getAllPosts Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getAllPosts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
