const httpStatus = require('http-status');
const { successCode } = require('../../../config/vars');
const { ErrorResponse, ResponseWithTotal } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

exports.auditLog = async (req, res) => {
  try {
    logger.info('AuditLogs Controller Request: ', req.body.data.userId);
    const { startDate, endDate } = req.body.data;
    const userNameAndRole = {
      username: res.locals.username,
      roleType: res.locals.roleType
    };
    const response = await tex.getAuditLogs(userNameAndRole, startDate, endDate, req.body.data);
    const { resultCode, body } = response;
    if (resultCode === successCode) {
      const jsonResponse = ResponseWithTotal(httpStatus.OK, body.data, body.total);
      res.status(httpStatus.OK);
      logger.info('AuditLogs Controller Response: ', jsonResponse);
      return res.json(jsonResponse);
    } else {
      const errResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        errorMessage(response)
      );
      logger.error('Failed user AuditLog Details: ', response);
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(errResponse);
    }
  } catch (exception) {
    logger.error('Failed user AuditLog Details: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
