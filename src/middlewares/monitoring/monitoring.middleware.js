/**
 * Monitoring Middleware
 *
 */
const responseTime = require('response-time');
const sanitizer = require('node-sanitizer');
const { logger } = require('../../utils/logger');
const { serviceName } = require('../../config/vars');
const { ignoreLogForPaths, sanitizedFields } = require('../../config/vars');
const pjson = require('../../../package.json');

const monitoringMiddleware = responseTime((req, res, time) => {
  const now = Date.now();
  const timestamp = new Date().toISOString();
  const logData = {
    url: req.originalUrl,
    time: timestamp,
    serviceName,
    version: '1.0',
    client: {
      ipAddress: req.ip
    },
    methodName: req.methodName,
    request: {
      header: req.headers,
      body: sanitizer(req.body, sanitizedFields),
      params: sanitizer(req.query, sanitizedFields)
    },
    response: {
      header: res.header()._headers,
      body: sanitizer(req.responseBody, sanitizedFields)
    },
    requestTime: Math.round((now - time) * 10) / 10,
    requestEnd: now,
    responseTime: time,
    statusCode: res.statusCode
  };

  // if (ignoreLogForPaths.indexOf(req.originalUrl) < 0) {
  //   logger.info('API Request', logData);
  // }
  logger.info('API Request', logData);
});

module.exports = monitoringMiddleware;
