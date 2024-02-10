const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const {
  Response,
  ErrorResponse
} = require('../../../utils/response');
const {
  logger
} = require('../../../utils/logger');
const tex = require('../../../services/tex');
const {
  errorMessage,
  encryptJSON
} = require('../../../utils/common');
const jwt = require('jsonwebtoken');
// const { successCode } = require('../../../config/vars');
const {
  parse
} = require('json2csv');

const {
  successCode
} = require('../../../config/vars');

// To get list of all cognito users and search for users based on query if present
exports.getUserData = async (req, res) => {
  try {
    const data = jwt.decode(req.headers.authorization);
    const username = data.username;
    const user = await tex.fetchUserDetails(username);
    const jsonResponse = Response(httpStatus.OK, {
      user: user.body.userData
    });
    jsonResponse.body = encryptJSON(jsonResponse.body);
    logger.info('Get User Data Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getUserData: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    console.log("calling createUser...........  ")

    console.log('Create User Info Controller Request:', req.body);
    const isAuthorizedUser = await tex.isAuthorizedUser(req, res, 'create');
    if (isAuthorizedUser) {
      console.log("isAuthorizedUser:  " + isAuthorizedUser)

      await tex.createUser(req.body.data, res.locals.username);
      const jsonResponse = Response(httpStatus.OK, {
        message: 'User created successfully'
      });
      logger.info('Create User Info Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } else {
      console.log("isAuthorizedUser:  " + isAuthorizedUser)

      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR, {
          message: `UnAuthorized create operation for ${res.locals.username}`
        }
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    };
  } catch (exception) {
    logger.error('Failed CreateUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  } finally {
    // GetSyncDBDisconnection(dbconnection);
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    logger.info('Get User Details Info Controller Request:', req.query);
    const user = await tex.getUser(req.params.username);
    const groupIds = await tex.getUserGroupIds(user.id);
    const policyIds = await tex.getUserPolicyIds(user.id);
    const jsonResponse = Response(httpStatus.OK, {
      groupIds,
      policyIds
    });
    logger.info('Get User Details Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getUserDetails: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.fetchParentUsersDetails = async (req, res) => {
  try {
    logger.info('Get User Details Info Controller Request:', {
      params: req.params,
      query: req.query
    });
    const parentUsers = await tex.fetchParentUsersDetails(req.params, req.query);
    const jsonResponse = Response(httpStatus.OK, {
      parentUsers
    });
    logger.info('Get User Details Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getUserDetails: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.updateUser = async (req, res) => {
  // const dbconnection = GetSyncDBConnection();
  try {
    logger.info('Update User Info Controller Request:', req.body);
    const roleType = await tex.getRoleType(req.params.username);
    logger.info(`userRoleType for update User ${roleType} & roletype of creator ${res.locals.roleType}`);
    if (roleType.type === 'dcaadmin' && res.locals.roleType === 'dcaadmin') {
      const jsonResponse = Response(httpStatus.FORBIDDEN, {
        message: 'permission denied !'
      });
      return res.status(httpStatus.FORBIDDEN).json(jsonResponse);
    }
    // const parentUserName = req.body.auditLog.userId;
    // const user = await tex.getParentUserId(parentUserName);

    // if (user !== undefined) {
    //   const parentUserId = user.id;
    //   req.body.data.parentUserId = parentUserId;
    // }
    const isAuthorizedUser = await tex.isAuthorizedUser(req, res, 'update');
    if (isAuthorizedUser) {
      await tex.editUser(req.body.data, req.params.username, res.locals.username);
      // await tex.updateUser(req.body, req.params.username);
      const jsonResponse = Response(httpStatus.OK, {
        message: 'User updated successfully'
      });
      logger.info('Update User Info Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } else {
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR, {
          message: `UnAuthorized update operation for ${res.locals.username}`
        }
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    }
  } catch (exception) {
    logger.error('Failed updateUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  } finally {
    // GetSyncDBDisconnection(dbconnection);
  }
};

exports.updateEndUser = async (req, res) => {
  // const dbconnection = GetSyncDBConnection();
  try {
    logger.info('Update User Info Controller Request:', req.body);
    const isAuthorizedUser = await tex.isAuthorizedEndUser(req, res, 'update');
    if (isAuthorizedUser) {
      await tex.editEndUser(req.body.data, req.params.username, res.locals.username);
      const jsonResponse = Response(httpStatus.OK, {
        message: 'User updated successfully'
      });
      logger.info('Update User Info Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } else {
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR, {
          message: `UnAuthorized update operation for ${res.locals.username}`
        }
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    }
  } catch (exception) {
    logger.error('Failed updateUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  } finally {
    // GetSyncDBDisconnection(dbconnection);
  }
};

exports.softDeleteUser = async (req, res) => {
  // const dbconnection = GetSyncDBConnection();
  try {
    logger.info('Delete User Info Controller Request:', req.body);
    const userRoleType = await tex.getRoleType(req.body.data.username);
    logger.info(`userRoleType for softDelete ${userRoleType} & roletype of creator ${res.locals.roleType}`);
    if (userRoleType.type === 'dcaadmin' && res.locals.roleType === 'dcaadmin') {
      const jsonResponse = Response(httpStatus.FORBIDDEN, {
        message: 'permission denied !'
      });
      return res.status(httpStatus.FORBIDDEN).json(jsonResponse);
    }
    const username = req.body.data.username;
    const [roleType, userId] = await tex.softDeleteUser(username);
    if (roleType === 'dcaagency') {
      await tex.softDeletedDcaUser(username, userId);
    }
    const jsonResponse = Response(httpStatus.OK, {
      message: 'User deleted successfully'
    });
    logger.info('Delete User Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed Delete User: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  } finally {
    // GetSyncDBDisconnection(dbconnection);
  }
};
exports.deleteUser = async (req, res) => {
  try {
    logger.info(
      `Delete User Info Controller Request,
      ${req.params.username}`

    );
    const userRoleType = await tex.getRoleType(req.params.username);
    logger.info(`userRoleType for enable/disable ${userRoleType} & roletype of creator ${res.locals.roleType}`);
    if (userRoleType.type === 'dcaadmin' && res.locals.roleType === 'dcaadmin') {
      const jsonResponse = Response(httpStatus.FORBIDDEN, {
        message: 'permission denied !'
      });
      return res.status(httpStatus.FORBIDDEN).json(jsonResponse);
    }
    const user = res.locals.roleType === 'dcaadmin' ? await tex.dcaDisableGroupUser(req.params.username, req.query.status) : await tex.deleteUser(req.params.username, req.query.status);
    const jsonResponse = Response(httpStatus.OK, {
      user
    });
    logger.info('Delete User Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed deleteUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.checkUsernameAvailability = async (req, res) => {
  try {
    logger.info(
      'Check User Availability Info Controller Request:',
      req.body.username
    );
    const isAvailable = await tex.checkUsernameAvailability(
      req.body.data.username
    );
    const jsonResponse = Response(httpStatus.OK, {
      isAvailable
    });
    logger.info(
      'Check User Availability Info Controller Response:',
      jsonResponse
    );
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed checkUsernameAvailability: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.checkEmailAvailability = async (req, res) => {
  try {
    logger.info(
      'Check Email Availability Info Controller Request:',
      req.body.email
    );
    const isAvailable = await tex.checkEmailAvailability(req.body.data.email);
    const jsonResponse = Response(httpStatus.OK, {
      isAvailable
    });
    logger.info(
      'Check Email Availability Info Controller Response:',
      jsonResponse
    );
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed checkEmailAvailability: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getUserList = async (req, res) => {
  try {
    logger.info('Get User Details Info Controller Request:');
    const params = req.query;
    const users = res.locals.roleType === 'dcaagency' ?
      await tex.getDcaAdminList(params, res.locals.id, res.locals.agencyCode) :
      res.locals.roleType === 'dcaadmin' ?
      await tex.getDcaList(params, res.locals.id) :
      await tex.getUserList(params);
    const jsonResponse = Response(httpStatus.OK, {
      users
    });
    logger.info('Get User Details Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getUserList: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.downloadUserList = async (req, res) => {
  logger.info('downloadUserList input values', req);
  try {
    const listUsersInfo = await tex.listUsers(req, res.locals.username, true);
    const fields = listUsersInfo.fields;
    const users = listUsersInfo.users;
    const opts = {
      fields
    };
    logger.info('users list for downloading', users);
    const usersList = [];
    const response = {
      resultcode: successCode,
      body: {
        fileData: '',
        msg: ''
      }

    };
    for (const [key] of Object.entries(users)) {
      usersList.push(users[key]);
    }
    const csv = parse(usersList, opts);
    logger.info('data getting logged as csv', csv);
    if (!csv) {
      response.resultcode = successCode;
      response.body.msg = 'no user list found !';
    } else {
      response.resultcode = successCode;
      response.body.fileData = csv;
    }
    const jsonResponse = Response(httpStatus.OK, response);
    res.status(httpStatus.OK);

    return res.json(jsonResponse);
  } catch (exception) {
    logger.error('Failed downloadUsersList: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.usernameList = async (req, res) => {
  try {
    logger.info(
      'Get Username list  Controller Request:',
      req.body.username
    );
    const usersList = await tex.userLists();
    const jsonResponse = Response(httpStatus.OK, {
      usersList
    });
    logger.info(
      'Check User Availability Info Controller Response:',
      jsonResponse
    );
    return res.json(jsonResponse);
  } catch (exception) {
    logger.error('Failed checkUsernameAvailability: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.fetchUsers = async (req, res) => {
  try {
    logger.info(
      'User details requested..!!', {
        params: req.params,
        query: req.query
      }
    );
    const auditLog = {
      ipAddress: req.query.ipAddress,
      hostName: req.query.hostName
    };
    delete req.query.ipAddress;
    delete req.query.hostName;
    const users = await tex.fetchUser(req.params, req.query, auditLog);
    const jsonResponse = Response(httpStatus.OK, {
      users
    });
    logger.info('Fetch User Details Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed to fetch users: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.setUserStatus = async (req, res) => {
  try {
    logger.info(
      'Set User Status Params', {
        params: req.params,
        query: req.query
      }
    );
    const auditLog = {
      ipAddress: req.query.ipAddress,
      hostName: req.query.hostName
    };
    delete req.query.ipAddress;
    delete req.query.hostName;
    const isAuthorizedUser = await tex.isAuthorizedUser(req, res, 'update');
    if (isAuthorizedUser) {
      const users = await tex.setUserStatus(req, req.body.data, auditLog);
      const jsonResponse = Response(httpStatus.OK, {
        users
      });
      logger.info('Set User Status Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } else {
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR, {
          message: `UnAuthorized operation for ${res.locals.username}`
        }
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    };
  } catch (exception) {
    logger.error('Failed to fetch users: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.listUsers = async (req, res) => {
  try {
    logger.info(
      'List User Controller Params', {
        params: req.params,
        query: req.query
      }
    );
    const users = await tex.getAllUsers(req, res.locals.username);
    const jsonResponse = Response(httpStatus.OK, {
      users
    });
    logger.info('Success: List Users Controller Response :', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failure: List Users Controller Error :', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const users = await tex.getUserById(req.params.id);
    const jsonResponse = Response(httpStatus.OK, {
      users
    });
    logger.info('Success: List Users Controller Response :', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failure: List Users Controller Error :', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.isAuthorizedUser = async (req, res) => {
  try {
    logger.info(
      'List User Controller Params', {
        params: req.params,
        query: req.query
      }
    );
    const isAuthorized = await tex.isAuthorizedUser(req, res, req.params.mode);
    logger.info(`Success: User Authorization Controller Response : ${isAuthorized}`);
    if (isAuthorized) {
      const jsonResponse = Response(httpStatus.OK, {
        message: `User authorized to ${req.params.mode}.`
      });
      res.status(httpStatus.OK);
      return res.status(httpStatus.OK).json(jsonResponse);
    } else {
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR, {
          message: `User not authorized to ${req.params.mode}.`
        }
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    }
  } catch (exception) {
    logger.error('Failure: User Authorization Controller Error :', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    console.log("calling registerUser...........  ")

    console.log('Create User Info Controller Request:', req.body);

    await tex.registerUser(req.body.data, res.locals.username);
    const jsonResponse = Response(httpStatus.OK, {
      message: 'User register successfully'
    });
    logger.info('Register User Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);

  } catch (exception) {
    logger.error('Failed CreateUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    await tex.uploadImage(req.body);
    const jsonResponse = Response(httpStatus.OK, {
      message: 'User upload image successfully'
    });
    logger.info('Update User Info Upload Image Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed updateUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  } finally {
    // GetSyncDBDisconnection(dbconnection);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    await tex.updateProfile(req.body);
    const jsonResponse = Response(httpStatus.OK, {
      message: 'User Profile Successfully Updated'
    });
    logger.info('Update User Info Upload Image Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed updateUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  } finally {
    // GetSyncDBDisconnection(dbconnection);
  }
};

exports.markUserisFresher = async (req, res) => {
  try {
    await tex.markUserisFresher(req.body);
    const jsonResponse = Response(httpStatus.OK, {
      message: 'User update fresher successfully'
    });
    logger.info('Update User Info update fresher Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed updateUser: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

  exports.profileShare = async (req, res) => {
    try {
      const { artistId, sharedBy } = req.body.data;
      logger.info('Create profileShare Controller Request:', artistId, sharedBy );
      const profile = await tex.profileShare(artistId, sharedBy);
      const jsonResponse = Response(httpStatus.OK, { profile });
      logger.info('Create profileShare Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } catch (exception) {
      logger.error('Failed profileShare: ', exception);
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        errorMessage(exception)
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    }
  };

  exports.profileLike = async (req, res) => {
    try {
      const { artistId, likedBy, islike } = req.body.data;
      logger.info('Create profileLike Controller Request:', artistId, likedBy, islike );
      const profile = await tex.profileLike(artistId, likedBy, islike);
      const jsonResponse = Response(httpStatus.OK, { profile });
      logger.info('Create profileLike Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } catch (exception) {
      logger.error('Failed profileLike: ', exception);
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        errorMessage(exception)
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    }
  };

  exports.profileSave = async (req, res) => {
    try {
      const { artistId, savedBy, isSave} = req.body.data;
      logger.info('Create profileSave Controller Request:', artistId, savedBy, isSave );
      const profile = await tex.profileSave(artistId, savedBy, isSave);
      const jsonResponse = Response(httpStatus.OK, { profile });
      logger.info('Create profileSave Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } catch (exception) {
      logger.error('Failed profileSave: ', exception);
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        errorMessage(exception)
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    }
  };

  exports.profileView = async (req, res) => {
    try {
      const { artistId, viewedBy } = req.body.data;
      logger.info('Create profileView Controller Request:', artistId, viewedBy );
      const profile = await tex.profileView(artistId, viewedBy);
      const jsonResponse = Response(httpStatus.OK, { profile });
      logger.info('Create profileView Controller Response:', jsonResponse);
      return res.status(httpStatus.OK).json(jsonResponse);
    } catch (exception) {
      logger.error('Failed profileView: ', exception);
      const jsonResponse = ErrorResponse(
        httpStatus.INTERNAL_SERVER_ERROR,
        errorMessage(exception)
      );
      res.status(httpStatus.INTERNAL_SERVER_ERROR);
      return res.json(jsonResponse);
    }
  };


    exports.profileCounts = async (req, res) => {
      try {
        const profile = await tex.profileCount(req.params.id, req.params.userId);
        const jsonResponse = Response(httpStatus.OK, { profile: profile.body.data });
        logger.info('Create profileCounts Controller Response:', jsonResponse);
        return res.status(httpStatus.OK).json(jsonResponse);
      } catch (exception) {
        logger.error('Failed profileCounts: ', exception);
        const jsonResponse = ErrorResponse(
          httpStatus.INTERNAL_SERVER_ERROR,
          errorMessage(exception)
        );
        res.status(httpStatus.INTERNAL_SERVER_ERROR);
        return res.json(jsonResponse);
      }
    };
