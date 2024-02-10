/* istanbul ignore file */
// Add this to the VERY top of the first file loaded in your app
// const async = require('async');
const { logger } = require('./utils/logger');
const { port, env, testenv } = require('./config/vars');
const axios = require('axios');
const app = require('./middlewares/express');
axios.defaults.timeout = parseInt(process.env.AXIOS_TIMEOUT);
axios.defaults.timeoutErrorMessage = process.env.AXIOS_TIMEOUT_ERROR_MSG;

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

axios.interceptors.response.use((response) => response, (error) => {
  // If condition is to handle the Timeout error,  other errors will be handled in else
  // console.log("ECONNABORTED", error.);
  if (error.code === 'ERR_UNHANDLED_REJECTION') {
    const x = Promise.reject(new Error(error.config.timeoutErrorMessage, { cause: 'timeout' }));
    return wait().then(() => x).catch(() => x);
  } else {
      const x =  Promise.reject(error);
      return wait().then(() => x).catch(() => x);
  }
});


app.listen(port, () => {
  logger.info(
    `API - Service => Server started on port ${port} (${env}) (${testenv})`
  );
});
/**
 * Exports express
 * @public
 */
module.exports = app;
