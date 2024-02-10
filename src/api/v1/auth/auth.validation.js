const joi = require("joi");

exports.auth = {
  body: joi.object().keys({
    data:{
    username: joi.string().required(),
    password: joi.string().required(),
    token: joi.string().allow('').optional(),
    isMobile: joi.boolean().optional()
    },
    auditLog: {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      timestamp: joi.date(),
      ipAddress: joi.string(),
      hostName: joi.string(),
    }
  }),
};
