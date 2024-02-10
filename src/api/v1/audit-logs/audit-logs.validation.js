const joi = require('joi');

exports.auditLog = {
  body: joi.object().keys({
    data: {
      userId: joi.string().min(3).max(30).required(),
      startDate: joi.number().optional(),
      endDate: joi.number().optional(),
      pagination: joi.number().optional(),
      username: joi.string().optional(),
      limit: joi.number().optional(),
      offset: joi.number().optional()


    },
    auditLog: {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      ipAddress: joi.string(),
      hostName: joi.string()
    }
  })
};
