const APIError = require('./APIError');
const { wrapError } = require('./../ErrorCode');

/**
 * Generate auth error
 * @param  {String} status              HTTP Status
 * @param  {String} route               API Route
 * @param  {String} message             IDP Error Message
 * @param  {String} errorCode           Detail error code
 * @param  {String} title               Detail error title
 * @param  {String} description         Detail error description
 * @param  {String} debugDescription    Detail debug description
 */
const generateError = (errorCode, errorMessage, debugDescription, errorUIMessage) => new APIError({
  status: 400,
  errors: [
    wrapError(
      errorCode,
      errorMessage,
      debugDescription,
      errorUIMessage
    )
  ]
});

const generateShortError = (errorCode, errorMessage, debugDescription, errorUIMessage) => [{
  errorCode,
  errorMessage,
  debugDescription,
  errorUIMessage
}];

module.exports = {
  generateError,
  generateShortError
};
