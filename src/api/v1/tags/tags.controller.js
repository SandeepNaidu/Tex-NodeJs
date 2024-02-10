const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

exports.createTag = async (req, res) => {
  try {
    logger.info('Create Tag Controller Request:', req.body.data.name);
    const tag = await tex.createTag(req.body.data.name);
    const jsonResponse = Response(httpStatus.OK, { tag });
    logger.info('Create Tag Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createTag: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getTagsById = async (req, res) => {
  try {
    logger.info('Get Tag ById Controller Request:', req.params.ids);
    const tags = await tex.getTagsById(req.params.ids);
    const jsonResponse = Response(httpStatus.OK, {
      tags: tags.body.data
    });
    logger.info('Get Tag ById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getTags: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};


exports.getTagsByName = async (req, res) => {
  try {
    logger.info('Get Tag ById Controller Request:', req.params.name);
    const tags = await tex.getTagsByName(req.params.name);
    const jsonResponse = Response(httpStatus.OK, {
      tags: tags.body.data
    });
    logger.info('Get Tag ById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getTags: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};


exports.getAllTags = async (req, res) => {
  try {
    logger.info('Get All Tag Controller Request:');
    const tags = await tex.getAllTags();
    const jsonResponse = Response(httpStatus.OK, {
      tags: tags.body.data
    });
    logger.info('Get All Tag Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed AllTags: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.deleteTagsById = async (req, res) => {
  try {
    logger.info('Delete Tag ById Controller Request:', req.params.ids);
    const tags = await tex.deleteTagsById(req.params.ids);
    const jsonResponse = Response(httpStatus.OK, {
      tags: tags.body.data
    });
    logger.info('Delete Tag ById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed deleteTags: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};


exports.editTagsById = async (req, res) => {
  try {
    logger.info('edit Tag ById Controller Request:', req.params.ids);
    const tags = await tex.editTagsById(req.params.ids, req.body.data.name);
    const jsonResponse = Response(httpStatus.OK, {
      tags: tags.body.data
    });
    logger.info('edit Tag ById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editTags: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
