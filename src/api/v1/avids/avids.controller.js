const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

exports.createPostThroughAvid = async (req, res) => {
  try {
    const { artistId, content, coverContent, title, caption, hashTag, mode } = req.body.data;
    logger.info('Create Post Controller Request:', artistId, content, coverContent, title, caption, hashTag, mode);
    // const avid = await tex.createAvid(artistId, content, coverContent, title, caption, hashTag, mode);
    const jsonResponse = Response(httpStatus.OK, {
      data:"Testing"
    });
    logger.info('Create Post Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Post: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.createAvid = async (req, res) => {
  try {
    const { artistId, content, coverContent, title, caption, hashTag, mode } = req.body.data;
    logger.info('Create Avid Controller Request:', artistId, content, coverContent, title, caption, hashTag, mode);
    const avid = await tex.createAvid(artistId, content, coverContent, title, caption, hashTag, mode);
    const jsonResponse = Response(httpStatus.OK, { avid });
    logger.info('Create Avid Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createAvid: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAvidsById = async (req, res) => {
  try {
    logger.info('Get Avid ById Controller Request:', req.params.ids);
    const avid = await tex.getAvidsById(req.params.ids, req.params.artistId);
    const jsonResponse = Response(httpStatus.OK, {
      avid: avid.body.data
    });
    logger.info('Get Avid ById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getAvidById: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAvidsByArtistId = async (req, res) => {
  try {
    logger.info('Get getAvidsByArtistIdController Request:', req.params.id);
    const avid = await tex.getAvidsByArtistId(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      avid: avid.body.data
    });
    logger.info('Get getAvidsByArtistIdController Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getAvidsByArtistId: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getAllAvids = async (req, res) => {
  try {
    logger.info('Get All Avids Controller Request by mode:',req.params.mode);
    const avids = await tex.getAllAvids(req.params.mode);
    const jsonResponse = Response(httpStatus.OK, {
      avids: avids.body.data
    });
    logger.info('Get All Avids Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed AllAvids: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.editAvidById = async (req, res) => {
  try {
    logger.info(
      'Edit editAvidById Controller Request:',
      req.params.id,
      req.body.data
    );
    const avid = await tex.editAvidById(req.params.id, req.body.data);
    const jsonResponse = Response(httpStatus.OK, { avid });
    logger.info('Edit editAvidById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editAvidById: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.avidShare = async (req, res) => {
  try {
    const { artistId, avidId } = req.body.data;
    logger.info('Create avidShare Controller Request:', artistId, avidId );
    const avid = await tex.avidShare(artistId, avidId);
    const jsonResponse = Response(httpStatus.OK, { avid });
    logger.info('Create avidShare Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed avidShare: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.avidLike = async (req, res) => {
  try {
    const { artistId, avidId, islike } = req.body.data;
    logger.info('Create avidLike Controller Request:', artistId, avidId, islike );
    const avid = await tex.avidLike(artistId, avidId, islike);
    const jsonResponse = Response(httpStatus.OK, { avid });
    logger.info('Create avidLike Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed avidLike: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.avidSave = async (req, res) => {
  try {
    const { artistId, avidId, isSave} = req.body.data;
    logger.info('Create avidSave Controller Request:', artistId, avidId, isSave );
    const avid = await tex.avidSave(artistId, avidId, isSave);
    const jsonResponse = Response(httpStatus.OK, { avid });
    logger.info('Create avidSave Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed avidSave: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
