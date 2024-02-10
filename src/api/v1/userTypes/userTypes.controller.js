const httpStatus = require('http-status');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');
// const { GetSyncDBConnection } = require('../../../services/db');
// const jwt = require('jsonwebtoken');

// const { successCode } = require('../../../config/vars');

exports.fetchUserTypes = async (req, res) => {
  try {
    const userTypes = await tex.fetchUserTypes(req.param, req.query, res.locals.username);
    const jsonResponse = Response(httpStatus.OK, { userTypes });
    logger.info('Get User Data Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed to fetch user types: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
