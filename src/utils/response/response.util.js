/**
 * Response.util.js Utility
 *
 */
const Response = (status, body = []) => {
  const result = {
    responseCode: status,
    body
  };
  return result;
};

const ResponseWithTotal = (status, body = [], total) => {
  const result = {
    responseCode: status,
    body,
    total
  };
  return result;
};

const ErrorResponse = (status, exception) => {
  const body = {};
  body.errors = [{
    errorCode: status,
    errorUIMessage: (exception.body === undefined) ? exception.message : (exception.body.errors !== undefined ? exception.body.errors.message : (exception.body.data !== undefined ? exception.body.data.message : 'Error')),
    errorMessage: (exception.body === undefined) ? exception.message : (exception.body.errors !== undefined ? exception.body.errors.message : (exception.body.data !== undefined ? exception.body.data.message : 'Error')),
    debugDescription: (exception.body === undefined) ? exception.stack : (exception.body.errors !== undefined ? exception.body.errors.stack : (exception.body.data !== undefined ? exception.body.data.stack : 'Error'))
  }];
  const result = {
    responseCode: status,
    body
  };
  return result;
};

const LoginErrorResponse = (status, exception) => {
  const body = {};
  body.error = exception.message;
  body.errors = [{
    errorCode: status,
    errorUIMessage: (exception.body === undefined) ? exception.message : (exception.body.errors !== undefined ? exception.body.errors.message : (exception.body.data !== undefined ? exception.body.data.message : 'Error')),
    errorMessage: (exception.body === undefined) ? exception.message : (exception.body.errors !== undefined ? exception.body.errors.message : (exception.body.data !== undefined ? exception.body.data.message : 'Error')),
    debugDescription: (exception.body === undefined) ? exception.stack : (exception.body.errors !== undefined ? exception.body.errors.stack : (exception.body.data !== undefined ? exception.body.data.stack : 'Error'))
  }];
  const result = {
    error: exception.message,
    responseCode: status,
    body
  };
  return result;
};
module.exports = { Response, ErrorResponse, ResponseWithTotal, LoginErrorResponse };
