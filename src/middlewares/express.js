const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const interceptor = require("express-interceptor");
// const { errorMiddleware } = require('../middlewares/error');
const api = require("../api");
const middlewareMonitoring = require("../middlewares/monitoring");
const { jwtAuth } = require("../middlewares/middleware-passport");
const { userAuditLog } = require("./audit-log");
const { ValidationError } = require("express-validation");
const { logger } = require('../utils/logger')

/**
 * Express instance
 * @public
 */
const app = express();

app.use(cookieParser());

// enable CORS - Cross Origin Resource Sharing
app.use(function (req, res, next) {
  // Client URL from ENV file
  const allowedOrigins = [
    `${process.env.CLIENT_URL}`,
    `${process.env.CLIENT_URL1}`,
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  if (
    req.path !== "/tex/v1/auth/login" &&
    req.path !== "/tex/v1/auth/changePassword" &&
    req.path !== "/tex/v1/auth/forgotPassword" &&
    req.path !== "/tex/v1/auth/confirmForgotPassword" &&
    req.path !== "/tex/v1/users/register" &&
    req.path !== "/tex/v1/users/isUsernameAvailable" &&
    req.path !== "/tex/v1/users/isEmailAvailable" &&
    req.path !== "/tex/v1/users/enduser" &&
    req.path !== "/auth/facebook" 

  ) {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "DELETE, POST, GET, PUT, OPTIONS"
    );
  } else {
    res.setHeader("Access-Control-Allow-Methods", "POST");
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Expose-Headers", [
    "Authorization",
  ]);
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// Monitoring
// app.use(middlewareMonitoring);

const finalParagraphInterceptor = interceptor((req, res) => {
  // eslint-disable-line
  return {
    isInterceptable: () => true,
    intercept: (body, send) => {
      try {
        req.responseBody = JSON.parse(body); // eslint-disable-line
      } catch (e) {
        req.responseBody = body; // eslint-disable-line
      }
      send(body);
    },
  };
});

app.use(finalParagraphInterceptor);
//authorization middleware
app.use(jwtAuth);
// user audit trail
app.use(userAuditLog);
// Mount api routes
app.use("/tex", api);

app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    logger.error('Failed Validation:', err, req.url)
    return res.status(err.statusCode).json(err)
  }
})

// if error is not an instanceOf APIError, convert it.
// app.use(errorMiddleware.converter);

// catch 404 and forward to error handler
// app.use(errorMiddleware.notFound);

// error handler, send stacktrace only during development
// app.use(errorMiddleware.handler);

module.exports = app;
