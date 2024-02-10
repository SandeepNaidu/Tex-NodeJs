const { auditLog } = require("../../services/tex/auditLog.service");
const { logger } = require("../../utils/logger");

const userAuditLog = (req, res, next) => {
  try {
    // if(req.path === '/tex/v1/auditlogs' && req?.body?.data?.offset > 1)
    // next()
    // else{
    //   const clientIPAddress = req.headers["x-forwarded-for"]
    //   ? req.headers["x-forwarded-for"]
    //   : "127.0.0.0";
    // if (Object.keys(req.body).length != 0) {
    //   req.body.auditLog.ipAddress = clientIPAddress;
    //   req.body.auditLog.hostName = clientIPAddress.split(".")[0];
    //   if (req.method == "POST" || req.method == "PUT") {
    //     auditLog(req.body.auditLog);
    //   }
    //   if (req.method == "DELETE") {
    //     auditLog(req.body.auditLog);
    //   }
    // } else if (Object.keys(req.query).length != 0 && req.method == "GET") {
    //   req.query.ipAddress = clientIPAddress || "";
    //   req.query.hostName = clientIPAddress.split(".")[0] || "";
    //   auditLog(req.query);
    // }
    // next();

    // }
    next()
  } catch (error) {
    logger.error("Failed Audit Log: ", error);
  }
};

module.exports = {
  userAuditLog,
};
