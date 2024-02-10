const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse, LoginErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const UserSession = require('../../../utils/UserSession');
const { encryptJSON } = require('../../../utils/common');
const { errorMessage } = require('../../../utils/common');
const {
  GetSyncDBConnection,
  GetSyncDBDisconnection
} = require('../../../services/db');
const { bool, boolean } = require('joi');
// const moment = require('moment');
// To login user in application
/* istanbul ignore next */
exports.login = async (req, res, next) => {
  const dbconnection = GetSyncDBConnection();
  try {
    logger.info('Auth login AWS Info Controller Request:', req.body);
    //= ===================================//
    console.log('Auth login user username:', req.body.data.username);

    const users = await dbconnection('users').where('username', req.body.data.username);
    if (users.length > 0) {
      console.log('Auth login user found #######', users[0].email);

      // const userId = users[0].id;
      // const dcaUsers = await dbconnection('dca_users').where('userId', userId);
      const active = Number(users[0].isActive);
      // const deletedAt = users[0].userDeletedAt;

      if (!active && users[0].isDeleted === 'N') {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ authentication: false, error: 'User has been disabled' });
      }
      if (users[0].isDeleted === 'Y') {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({
            authentication: false,
            error: 'User has been deleted'
          });
      }

      const roleType = await dbconnection('roles')
        .where('roles.id', users[0].roleId);

      if (roleType[0].type === 'dca-agency' || roleType[0].type === 'dca-agent') {
        const dcaUsers = await dbconnection('tex_agencies')
          .where('tex_agencies.id', users[0].agencyId);
        const loginTime = dcaUsers[0].loginTime;

        const logoutTime = dcaUsers[0].logoutTime;
        if (loginTime && logoutTime) {
          const loginTimeArr = dcaUsers[0].loginTime.split(':');
          const logoutTimeArr = dcaUsers[0].logoutTime.split(':');
          const currentTime = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Asia/Singapore'
          });
          logger.info(`logintime from DB  ${loginTime}`);
          logger.info(`logout time from DB  ${logoutTime}`);
          logger.info(`current time raw ${currentTime}`);
          const currentTimeArr = currentTime.split(':');
          const loginTimeObj = new Date();
          loginTimeObj.setHours(parseInt(loginTimeArr[0]), parseInt(loginTimeArr[1]), 0);
          const logoutTimeObj = new Date();
          logoutTimeObj.setHours(parseInt(logoutTimeArr[0]), parseInt(logoutTimeArr[1]), 0);
          const currentTimeObj = new Date();
          currentTimeObj.setHours(parseInt(currentTimeArr[0]), parseInt(currentTimeArr[1]), 0);
          logger.info(`login time ${loginTimeObj}`);
          logger.info(`logout time ${logoutTimeObj}`);
          logger.info(`crrentime ${currentTimeObj}`);
          if (!(currentTimeObj > loginTimeObj && currentTimeObj < logoutTimeObj)) {
            return res
              .status(httpStatus.UNAUTHORIZED)
              .send({
                authentication: false,
                error: `User is authorized to login between ${loginTime}-${logoutTime}`
              });
          }
          if (users[0].isDeleted === 'Y') {
            return res
              .status(httpStatus.UNAUTHORIZED)
              .send({
                authentication: false,
                error: 'The user is deleted'
              });
          }
        }
      }
    };
    //= ===================================//

    const data = await tex.login(req.body.data);
    if (data.passwordChangeRequired) {
      const jsonResponse = Response(httpStatus.OK, {
        passwordChangeRequired: data.passwordChangeRequired
      });
      return res.status(httpStatus.OK).json(jsonResponse);
    }
    const { idToken, refreshToken } = data;
    console.log("calling UserSession..................: ");

    await UserSession(req.body.data.username, idToken, refreshToken);
    const jsonResponse = Response(httpStatus.OK, { idToken, refreshToken });
    const user = await tex.fetchUserDetails(req.body.data.username);
    jsonResponse.body.user = user.body.userData;
    logger.info('Auth LoginInfo Controller Response:', jsonResponse);
    if( req.body.data.isMobile === true) {
      return res.status(httpStatus.OK).json(jsonResponse);
    } else {
    jsonResponse.body = encryptJSON(jsonResponse.body);
    return res.status(httpStatus.OK).json(jsonResponse);
    }
  } catch (exception) {
    logger.error('Failed login: ', exception);
    const status = exception.status ? exception.status : httpStatus.INTERNAL_SERVER_ERROR;
    const jsonResponse = LoginErrorResponse(
      status,
      exception
    );
    res.status(status);
    return res.json(jsonResponse);
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};

// To force change the password of the user
exports.changePassword = async (req, res, next) => {
  try {
    logger.info('Auth Change Password Info Controller Request:', req.body.data);
    await tex.changePassword(req.body.data);
    const jsonResponse = Response(httpStatus.OK, {
      message: 'Reset Password is successful'
    });
    logger.info('Auth Change Password Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed changePassword: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      exception
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.mobileLogin = async (req, res) => {
  try {
    logger.info('Create Tag Controller Request:', req.body.data.number);
    const tag = await tex.mobileLogin(req.body.data.name);
    const jsonResponse = Response(httpStatus.OK, { tag });
    logger.info('Create Tag Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createTag: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    logger.info('Auth Forgot Password Info Controller Request:', req.body.data);
    const isAvailable = await tex.forgetPassword(req.body.data.username, res);
    const jsonResponse = Response(httpStatus.OK, { message: isAvailable.body.message });
    logger.info(
      'Auth Forgot Password Controller Response:',
      jsonResponse
    );
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed forgotPassword: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Confirm Forgot password
exports.confirmForgotPassword = async (req, res, next) => {
  try {
    logger.info(
      'Auth Confirm Forgot Password Info Controller Request:',
      req.body.data
    );
    await tex.confirmForgotPassword(req.body.data, res);
    const jsonResponse = Response(httpStatus.OK, {
      message: 'Password Reset is successful'
    });
    logger.info(
      'Auth Confirm Forgot Password Controller Response:',
      jsonResponse
    );
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed confirmForgotPassword: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      exception
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.adminResetPassword = async (req, res) => {
  try {
    logger.info('Admin Reset Password Controller Request:', req.body.data);
    tex.adminResetPassword(req.body.data);
    const jsonResponse = Response(httpStatus.OK, {
      message: 'Password Reset Successful'
    });
    logger.info('Admin Reset Password Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed adminResetPassword: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.signOut = async (req, res) => {
  try {
    await tex.signOut(req.headers.authorization);
    return res.status(httpStatus.OK).json({ logout: true });
  } catch (exception) {
    logger.error('Failed Signout: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
