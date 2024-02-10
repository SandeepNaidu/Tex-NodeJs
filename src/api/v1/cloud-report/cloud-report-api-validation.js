const joi = require('joi');

exports.cloudReportInfo = {
  body: joi.object().keys({
    data: {
      module: joi.string().required(),
      region: joi.string().required()
    },
    auditLog: {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      timestamp: joi.date(),
      ipAddress: joi.string(),
      hostName: joi.string()
    }
  })
};
