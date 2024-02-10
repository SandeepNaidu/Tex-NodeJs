/**
 * BasicAuth Middleware - To valida API and Partners if any
 *
 */
// const auth = require('basic-auth');
// const httpStatus = require('http-status');
// const { APIError } = require('../../utils/APIError');
// const { wrapError } = require('../../utils/ErrorCode');
const fetch = require("node-fetch")
const jwt = require('jsonwebtoken');
const httpStatus = require("http-status");
const { GetSyncDBConnection, GetSyncDBDisconnection } = require("../../services/db")
const {logger} = require("../../utils/logger");

const basicAuthMiddleware = async (req, res, next) => {
  if(!req.cookies.idToken) return res.status(401).json({authentication: false, error: "User not authenticated"})
  next();
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * BasicAuth Middleware for ValidateAPI
 */
// const validateBasicAuthMiddleware = async (req, res, next) => {
//   // next();
//   // If error ---- next(apiError);
// };
var userRoleType = ['dcaadmin','superadmin','dcaagency','admin'];
const humanCheck = async (req, res, next) => {
  const secret = process.env.GOOGLE_RECAPTCHA_TOKEN;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${req.body.data.token}`,
    {
      method: "POST",
    }
  );

  const data = { success: true } // await response.json();
  if (!data.success) {
    return res.status(400).json({ error: "Captcha expired. Please refresh" });
  }
  next();
};

const adminModuleAuth = async (req, res, next) => {
  const dbconnection = GetSyncDBConnection()
  try{
    if(!req.headers.authorization) return res.status(httpStatus.UNAUTHORIZED).json({error: "User not Authenticated"})

    const decodedToken = jwt.decode(req.headers.authorization)
    const userRoleId = parseInt(decodedToken["custom:role"])
    // const roleType = await dbconnection('roles').select('type').where('id', userRoleId);
    const roleType = await dbconnection.select('roles.type', 'tex_user_types.user_type').from('roles')
    .innerJoin('tex_user_types', 'tex_user_types.id', 'roles.user_type_id')
    .where('roles.id', userRoleId);
    logger.info('roleType in middleware', roleType);
    if(userRoleType.includes(roleType[0].type) || roleType[0].user_type === 'Artist_Admin' || roleType[0].user_type === 'Recruiter_Admin'){
      next()
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({error: "User not Authorized"})
    }
  }catch(error){
    logger.error("Error in Admin Auth Module Middleware", error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Something went wrong"})
  }finally {
    GetSyncDBDisconnection(dbconnection)
  }
}
//==============auto logout feature==============//
const autoLogoutForDCA = async (req, res, next) => {
  const dbconnection = GetSyncDBConnection()
  try{
  // if(res.locals.roleType === 'dca-agency'||res.locals.roleType === 'dca-agent' ){
      const users = await dbconnection('users').where('username', res.locals.username);
      if (users.length > 0) {
        logger.info('users ', users);

        if (users && users.length) {
          logger.info('user length', users.length);
          logger.info('users', users[0]);
          const roleType = await dbconnection('roles')
          .where('roles.id', users[0].roleId);
          const dcaUsers = await dbconnection('tex_agencies')
          .where('tex_agencies.id', users[0].agencyId);
       if(dcaUsers && dcaUsers.length>0){
          const loginTime = dcaUsers[0].loginTime;

          const logoutTime = dcaUsers[0].logoutTime;

          if ((loginTime && logoutTime)&&(roleType[0].type === 'dca-agency' || roleType[0].type === 'dca-agent')) {
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
            }else{
              next()
            }

          }
        }else {
            next();
          }

        } else {
          next();
        }

      }else{
        next();
      }

      // }else{
      //   next();
      // }

  }catch(error){
    logger.error("Error in Auto Logout for Dca Module Middleware", error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Something went wrong"})
  }finally {
    GetSyncDBDisconnection(dbconnection)
  }
}
//====================================================//
const agentCreateModuleAuth = async (req, res, next) => {
  const dbconnection = GetSyncDBConnection()
  try{
    if(res.locals.roleType === 'dcaagency')
    {
      let {
        agencyCode,
        loginTime,
        logoutTime,
        roleId,
        selectedGroups,
        selectedPolicies,
      } = req.body.data;

      let agencyInfo = await dbconnection('dca_users').select('*').where('userId',dbconnection('users').select('id').where('username',res.locals.username))
          agencyInfo=agencyInfo[0]
          const loginTimeArr = agencyInfo.loginTime.split(':');
          loginTimeArr.pop();
          agencyInfo.loginTime = loginTimeArr.join(':');
          const logoutTimeArr = agencyInfo.logoutTime.split(":");
          logoutTimeArr.pop();
          agencyInfo.logoutTime = logoutTimeArr.join(":");
          logger.info(`loginTime/logoutTime for dca agency check ${agencyInfo.loginTime + ' '+ agencyInfo.logoutTime}`)

        if( agencyCode.toUpperCase() !== agencyInfo.agencyCode.toUpperCase() || loginTime !== agencyInfo.loginTime || logoutTime !== agencyInfo.logoutTime)
          {
        logger.info('Failed to create dca agency:');

        return res.status(httpStatus.BAD_REQUEST).json({error: `AgencyCode , loginTime , LogoutTime must be same as ${res.locals.username}`})
      }

      // the dcaSelectedGroups and dcaSelectedPolicies would be Hard Code for current sprint
    let  dcaSelectedGroups = process.env.DCA_SELECTED_GROUPS
    let  dcaSelectedPolicies = process.env.DCA_SELECTED_POLICIES

      if(!selectedGroups.every(i => dcaSelectedGroups.includes(i))||!selectedPolicies.every(i => dcaSelectedPolicies.includes(i)))
      {
        logger.info('Failed to create dca agency:');
        return res.status(httpStatus.BAD_REQUEST).
        json({error: `Selected Group and policies restricted to DCA agent`})
      }
      next()
    }
    else{
      next()
    }
  }catch(error){
    logger.error("Error in Admin Auth Module Middleware", error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Something went wrong"})
  }finally {
    GetSyncDBDisconnection(dbconnection)
  }
}


const agentViewUserListAuth = async (req, res, next) =>{
  const dbconnection = GetSyncDBConnection()
  try{
      if(res.locals.roleType === 'dcaagency' && req.query.roleId && req.query.userId){
        const roleType = await dbconnection('roles').select('type').where('id', req.query.roleId)
        if(roleType[0].type !== res.locals.roleType){
          logger.info('Failed Agency Load DCA USER LIST DATA:');
          res.status(httpStatus.INTERNAL_SERVER_ERROR);
          return res.json({error: "User not Authorized"});
        }

        const username = await dbconnection('users').select('username').where('username', req.query.userId)
        if(username[0].username !== res.locals.username){
          logger.info('Failed Agency Load DCA USER LIST DATA:');
          res.status(httpStatus.INTERNAL_SERVER_ERROR);
          return res.json({error: "User not Authorized"});
        }
  }
    next();
  }catch(err){
    logger.error("Error in Admin Auth Module Middleware", error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Something went wrong"})
  }finally {
    GetSyncDBDisconnection(dbconnection)
  }

}

const agencySoftDeleteMiddleware = async (req, res, next) => {
  const dbconnection = GetSyncDBConnection()
  try{
    let userToDelete = req.body.data.username;

    userToDelete = await dbconnection('dca_users').select('agencyCode', 'roleType')
                .innerJoin('users', 'dca_users.userId', 'users.id')
                .where('username', userToDelete)
    if(!userToDelete[0])
    return res.status(httpStatus.BAD_REQUEST).json({error: `DCA user are not Exist`})

    if(res.locals.roleType !== 'dcaadmin')
    {
      let userTryingtoDelete =res.locals.username
          userTryingtoDelete = await dbconnection('dca_users').select('agencyCode','roleType')
                                    .innerJoin('users', 'dca_users.userId', 'users.id')
                                    .where('username', userTryingtoDelete)

     if(userTryingtoDelete[0].agencyCode.toUpperCase() !== userToDelete[0].agencyCode.toUpperCase())
       return res.status(httpStatus.BAD_REQUEST).json({error: `Not Authorized To Perform Deletion`})
     else
       next()
    }
    else{
      if(userToDelete[0].roleType === 'dcaadmin')
      {
        return res.status(httpStatus.BAD_REQUEST).json({error: `Not Authorized To Delete DCA Admin`})
      }
      next()
    }

  }catch(err){
    logger.error("Error in Admin Auth Module Middleware", err)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: err})
  }finally {
    GetSyncDBDisconnection(dbconnection)
  }
}

module.exports = {
  basicAuthMiddleware,
  agencySoftDeleteMiddleware,
  // validateBasicAuthMiddleware,
  humanCheck,
  adminModuleAuth,
  autoLogoutForDCA,
  agentCreateModuleAuth,
  agentViewUserListAuth
};
