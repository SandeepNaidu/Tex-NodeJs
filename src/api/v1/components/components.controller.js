const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

// Get list of all components
exports.getComponents = async (req, res) => {
  try {
    const components = await tex.getComponents();
    const jsonResponse = Response(httpStatus.OK, {
      components: components.body.data
    });
    logger.info('Get Components Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getComponents: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Create a new component
exports.createComponent = async (req, res) => {
  try {
    logger.info('Create Component Controller Request:', req.body.data.name);
    const component = await tex.createComponent(req.body.data.name);
    const jsonResponse = Response(httpStatus.OK, { component });
    logger.info('Create Component Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createComponent: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Edit a component
exports.editComponent = async (req, res) => {
  try {
    logger.info(
      'Edit Component Controller Request:',
      req.params.id,
      req.body.name
    );
    const component = await tex.editComponent(
      req.params.id,
      req.body.data.name
    );
    const jsonResponse = Response(httpStatus.OK, { component });
    logger.info('Edit Component Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editComponent: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
// change status of a component
exports.updateComponentStatus = async (req, res) => {
  try {
    logger.info(
      'Update Component Controller Request:',
      req.params.id,
      req.query.status
    );
    const component = await tex.updateComponentStatus(
      req.params.id,
      req.query.status
    );
    const jsonResponse = Response(httpStatus.OK, { component });
    logger.info('Update Component Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed updateComponentStatus: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
// get component by id
exports.getComponentsById = async (req, res) => {
  try {
    logger.info('Get Component ById Controller Request:', req.params.id);
    const components = await tex.getComponentsById(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      components: components.body.data
    });
    logger.info('Get Component ById Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getComponents: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
