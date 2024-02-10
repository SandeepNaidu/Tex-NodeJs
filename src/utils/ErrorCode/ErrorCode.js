/* eslint-disable */
const httpStatus = require('http-status');

exports.routes = {
  createuser:'createuser',
  roles:'roles',
  usergroups: 'usergroups',
  createUserRoles: 'createUserRoles'
};

exports.errorCodes = {
  '01': httpStatus.OK,
  '101': httpStatus.FORBIDDEN,
  '102': httpStatus.FORBIDDEN,
  '103': httpStatus.BAD_REQUEST,
  '200': httpStatus.UNAUTHORIZED
};

exports.services = {
  sample: 'sample'
};

exports.codes = {
  createuserError:'createuserError',
  rolesError:'rolesError',
  usergroupsError: 'usergroupsError',
  createUserRolesError: 'createUserRolesError'
};

exports.getErrorCode = (route, service, code) => {
  const result = ['sample', route, service, code].join(':');
  return result; 
};

exports.wrapError = (errCode, errTitle, errDebugDesc, errorUIMessage) => {
  const result = {
    errorCode: errCode,
    errorTitle: errTitle,
    errorDebugDescription: errDebugDesc,
    errorUIMessage
  };
  return result;
};

exports.convertSSOCode = (ssoCode) => {
  switch (ssoCode) {
    case '01':
      return httpStatus.OK;
    case '101':
      return httpStatus.FORBIDDEN;
    case '102':
      return httpStatus.FORBIDDEN;
    case '103':
      return httpStatus.BAD_REQUEST;
    case '200':
      return httpStatus.UNAUTHORIZED;
  }
  return httpStatus.BAD_REQUEST;
};
