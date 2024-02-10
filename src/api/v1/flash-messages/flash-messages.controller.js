const httpStatus = require('http-status');
const { successCode } = require('../../../config/vars');
const { flashMessagesMockData } = require('../../../config/fakeresponse');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

// To Get the flash messages info from CRM db using accountID.
exports.flashMessagesInfo = async (req, res, next) => {
  try {
    const params = req.body.data;
    const roleType = res.locals.roleType;
    logger.info('flash messages Info Controller Request:', params);
    // Bypassing the DB call as we don't have DB connectivity
    const response = await tex.getFlashMessageInfo(params, roleType);
    const { resultcode, body } = response;
    if (resultcode === successCode) {
      const jsonResponse = Response(httpStatus.OK, body);
      res.status(httpStatus.OK);
      logger.info('flash messages Controller Response:', jsonResponse);
      return res.json(jsonResponse);
    } else {
      /* This ELSE should be removed once DB connection is active */
      const jsonResponse = Response(httpStatus.OK, flashMessagesMockData);
      res.status(httpStatus.OK);
      return res.json(jsonResponse);
    }
  } catch (exception) {
    logger.error('Failed flash messages: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
