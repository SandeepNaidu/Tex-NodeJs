const httpStatus = require('http-status');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const aws = require('../../../services/aws');
const { errorMessage } = require('../../../utils/common');
const { successCode } = require('../../../config/vars');
// const tex = require('../../../services/tex);

exports.getCloudReport = async (req, res) => {
  try {
    logger.info('Get Cloud Report Controller Request:', req.query);
    const cloudReportInfo = req.body.data;
    const collectCloudReport = await aws.collectCloudReport(cloudReportInfo);
    if (collectCloudReport.resultCode === successCode) {
      logger.info('Collect Cloud Report Controller Response: ');
      const jsonResponse = Response(httpStatus.OK, collectCloudReport);
      res.status(httpStatus.OK);
      logger.info('Get Cloud Report Controller Response: ');
      return res.json(jsonResponse);
    } else {
      const errResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        errorMessage(collectCloudReport.body.message)
      );
      logger.error('Failed Get Cloud Report Controller: ', collectCloudReport);
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(errResponse);
    }
  } catch (exception) {
    logger.error('Failed Cloud Report: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
