const joi = require("joi");

exports.component = {
  body: joi.object().keys({
    data:{
    name: joi.string().required()
    },
    auditLog : {
      userId: joi.string(),
      activity: joi.string(),
      description: joi.string(),
      page: joi.string(),
      ipAddress: joi.string(),
      hostName: joi.string(),
    }
  }),
};
