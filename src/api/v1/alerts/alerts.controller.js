const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

// Get list of all alerts
exports.getAlerts = async (req, res) => {
  try {
    let alerts;
    /* istanbul ignore else */
    if (req.query.active) {
      alerts = await tex.getActiveAlerts();
    } else {
      alerts = await tex.getAlerts();
    }
    const jsonResponse = Response(httpStatus.OK, {
      alerts: alerts.body.data
    });
    logger.info('Get Alerts Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getAlerts: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Create a new alert
exports.createAlert = async (req, res) => {
  try {
    logger.info('Create Alert Controller Request:', req.body.data);
    const alert = await tex.createAlert(req.body.data);
    const jsonResponse = Response(httpStatus.OK, { alert });
    logger.info('Create Alert Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createAlert: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Edit a alert
exports.editAlert = async (req, res) => {
  try {
    logger.info('Edit Alert Controller Request:', req.params.id, req.body.data);
    const alert = await tex.editAlert(req.params.id, req.body.data);
    const jsonResponse = Response(httpStatus.OK, { alert });
    logger.info('Edit Alert Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editAlert: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
// delete an alert
exports.deleteAlert = async (req, res) => {
  try {
    logger.info('Delete Alert Controller Request:', req.params.id);
    const alert = await tex.deleteAlert(req.params.id);
    const jsonResponse = Response(httpStatus.OK, { alert });
    logger.info('Delete Alert Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed deleteAlert: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
