const joi = require("joi");

exports.role = {
  body: joi.object().keys({
    data:{
    name: joi.string().required(),
    type: joi.string().required(),
    module: joi.number()
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
