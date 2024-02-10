const httpStatus = require("http-status");
const { refreshUserToken } = require("../../services/aws");
const { getUserPolicies } = require('../../services/tex');
const jwt = require("jsonwebtoken");
const moment = require('moment');
const {
  GetSyncDBConnection,
  GetSyncDBDisconnection,
} = require("../../services/db");
const { logger } = require("../../utils/logger");

//Our middleware that authenticates all APIs under our 'authenticatedRoute' Router
const jwtAuth = async (req, res, next) => {  
  if (req.method === "OPTIONS") return next();
  const dbconnection = GetSyncDBConnection();
  try {
    if (
      req.path !== "/tex/v1/auth/login" &&
      req.path !== "/tex/v1/auth/changePassword" &&
      req.path !== "/tex/v1/auth/forgotPassword" &&
      req.path !== "/tex/v1/auth/confirmForgotPassword" &&
      req.path !== "/tex/v1/users/userDetails" &&
      req.path != "/tex/v1/auth/signout" &&
      req.path !== "/tex/v1/alerts" &&
      req.path !== "/tex/v1/users/register" &&
      req.path !== "/tex/v1/users/isUsernameAvailable" &&
      req.path !== "/tex/v1/users/isEmailAvailable" &&
      req.path !== "/tex/v1/users/enduser" &&
      req.path !== "/auth/facebook" 
    ) {
      //Expecting access token in header under key accessToken
      let idTokenFromClient = req.headers.authorization;
      let userId;

      //Fail if token not present in header.
      if (!idTokenFromClient)
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ authentication: false, error: "User not authenticated" });
      const decodedToken = jwt.decode(idTokenFromClient);
      const username = decodedToken["username"];
      res.locals.username = username;
      const roleTypeQuery = await dbconnection("roles").where('id', parseInt(decodedToken["custom:role"]));
      if(roleTypeQuery.length > 0) {
        res.locals.roleType = roleTypeQuery[0].type
        // req.locals.roleType = roleTypeQuery[0].type
      } else {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .send({ error: "Invalid Role" });
      }

      const user = await dbconnection("users").where("username", username);
      if (user.length > 0) {
        userId = user[0].id;
        active = Number(user[0].isActive)
        // deletedAt = user[0].userDeletedAt
        res.locals.id = user[0].id;
        const checkSession = await dbconnection("user_sessions").where({
          idToken: idTokenFromClient,
          userId,
        });
        if (checkSession.length > 0) {
          const isSessionActive = checkSession[0].activeSession;
          if (isSessionActive !== 1) {
            return res
              .status(httpStatus.UNAUTHORIZED)
              .send({
                authentication: false,
                error: "Someone else is using the session",
              });
          }
        } else {
          logger.info("check");
        }
      } else {
        logger.info("invalid token username not in DB");
      }
    if(!active && user[0].isDeleted === 'N'){
      return res
      .status(httpStatus.UNAUTHORIZED)
      .send({ authentication: false, error: "User has been disabled" });
    }
    if(user[0].isDeleted === 'Y'){
      return res
      .status(httpStatus.UNAUTHORIZED)
      .send({
        authentication: false,
        error: "User has been deleted",
      });
    }


    jwt.verify(idTokenFromClient, process.env.JWT_ENCRYPTION, async (err, decoded) => { 
         if(!err){
          res.header("Authorization", '');
          res.locals.user = decoded;
          next();
         }else{
              if (err.name === "TokenExpiredError") {
                      const refreshToken = await fetchRefreshTokenFromDB(
                        idTokenFromClient,
                        userId
                      ).catch(err=>{
                        return res.status(httpStatus.UNAUTHORIZED).send(err);
                      })
                      jwt.verify(refreshToken, process.env.JWT_ENCRYPTION, async (refreshErr, refreshDecoded) => { 
                        if(refreshErr){
                          return res.status(httpStatus.UNAUTHORIZED).send(refreshErr);
                        }else{
                          let newIdToken= jwt.sign({userId:refreshDecoded["userId"],"username":refreshDecoded["username"],"custom:role":refreshDecoded["custom:role"],email: refreshDecoded.email}, process.env.JWT_ENCRYPTION, {expiresIn: process.env.JWT_EXPIRATION});
                          let newRefreshToken= jwt.sign({userId:refreshDecoded["userId"],"username":refreshDecoded["username"],"custom:role":refreshDecoded["custom:role"],email: refreshDecoded.email}, process.env.JWT_ENCRYPTION, {expiresIn: process.env.REFRESH_EXPIRATON});
                          const dbconnection = GetSyncDBConnection();
                          await dbconnection("user_sessions")
                            .update({
                              idToken: newIdToken,
                              refreshToken: newRefreshToken,
                            })
                            .where({ idToken: idTokenFromClient, userId });
                          res.header("Authorization", newIdToken);
                          GetSyncDBDisconnection(dbconnection)
                          next();
                        }
                      })
              }
              else{
                return res.status(httpStatus.UNAUTHORIZED).send(err);
              }
         }
        
         } );

     
  
    } else if (
      req.path === "/tex/v1/auth/login" ||
      req.path === "/tex/v1/auth/changePassword" ||
      req.path === "/tex/v1/auth/forgotPassword" ||
      req.path === "/tex/v1/auth/confirmForgotPassword" ||
      req.path === "/tex/v1/users/userDetails" ||
      req.path === "/tex/v1/auth/signout" ||
      req.path === "/tex/v1/alerts" ||
      req.path === "/tex/v1/users/register" ||
      req.path === "/tex/v1/users/isUsernameAvailable" ||
      req.path === "/tex/v1/users/isEmailAvailable" ||
      req.path === "/tex/v1/users/enduser" ||
      req.path === "/auth/facebook" 
      
    ) {
      next();
    }
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  } finally {
    GetSyncDBDisconnection(dbconnection)
  }
};

const fetchRefreshTokenFromDB = (idToken, userId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection("user_sessions")
      .where({ idToken, userId })
      .then((success) => {
        if (success.length > 0) {
          resolve(success[0].refreshToken);
        } else {
          reject("Refresh Token not found");
        }
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

module.exports = {
  jwtAuth,
};