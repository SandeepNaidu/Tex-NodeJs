const joi = require("joi");

exports.flashMessageInfo = {
  body: joi.object().keys({
    data: {
      account_id: joi.string().min(8).max(8).required(),
    },
    auditLog: {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      timestamp: joi.date(),
      ipAddress: joi.string(),
      hostName: joi.string(),
    },
  }),
};
