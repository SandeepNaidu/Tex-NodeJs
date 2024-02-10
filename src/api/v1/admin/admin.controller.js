// const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
// const { Response, ErrorResponse } = require('../../../utils/response');
// const { logger } = require('../../../utils/logger');
// const aws = require('../../../services/aws');

// exports.permissionsByRoles = async (req, res, next) => {
//   try {
//     const permissions = await tex.getRoleBasedPermissions(req.body.roleId);
//     const jsonResponse = Response(httpStatus.OK, { permissions });
//     return res.status(httpStatus.OK).json(jsonResponse);
//   } catch (exception) {
//     logger.error('Failed getPermissionsByRoles: ', exception);
//     const jsonResponse = ErrorResponse(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       exception
//     );
//     res.status(httpStatus.INTERNAL_SERVER_ERROR);
//     return res.json(jsonResponse);
//   }
// };
