const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../aws/email.service');
const { decryptPassword, isStringBlank } = require('../../utils/common');
const bcrypt = require('bcryptjs');
const { sendOTP } = require('../aws/otp.service');

exports.fetchUserDetails = async function (username) {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    // dbconnection('users')
    //   .select('users.*', 'components.name', 'roles.type as roleType')
    //   .leftJoin('roles', 'roles.id', 'users.roleId')
    //   .leftJoin('user_policies', 'user_policies.userId', 'users.id')
    //   .leftJoin(
    //     'policies_components',
    //     'policies_components.policyId',
    //     'user_policies.policyId'
    //   )
    //   .leftJoin(
    //     'components',
    //     'policies_components.componentId',
    //     'components.id'
    //   )
    //   .where('users.username', username)
    dbconnection.raw('call tex_getUserByUsername(?)', [username])
      .then((data) => {
        data = data[0][0];
        // const components = data.map((d) => d.name);
        const {
          id,
          username,
          firstName,
          lastName,
          email,
          contactNumber,
          roleId,
          isFresher,
          profileImage,
          roleType
        } = data[0];
        const userData = {
          id,
          username,
          firstName,
          lastName,
          profileImage,
          email,
          isFresher,
          contactNumber,
          roleId,
          roleType
          // components
        };
        const response = {
          resultcode: successCode,
          body: {
            userData
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed FetchUser Info Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.updateUser = async (body, notes) => {
  const dbconnection = GetSyncDBConnection();
  try {
    const {
      username,
      firstName,
      lastName,
      roleId,
      selectedGroups,
      selectedPolicies,
      email,
      isFresher,
      profileImage,
      contactNumber
    } = body;
    await dbconnection('users').where({ username }).update({
      username,
      firstName,
      lastName,
      roleId,
      profileImage,
      email,
      isFresher,
      contactNumber,
      notes
    });
    const user = await dbconnection('users').where({ username });
    const userId = user[0].id;
    await dbconnection('user_groups').del().where({ userId });
    const userGroups = [];
    selectedGroups.forEach((group) => {
      userGroups.push({ userId, userGroupId: group });
    });
    await dbconnection('user_groups').insert(userGroups);
    await dbconnection('user_policies').del().where({ userId });
    const userPolicies = [];
    selectedPolicies.forEach((policy) =>
      userPolicies.push({ userId, policyId: policy })
    );
    await dbconnection('user_policies').insert(userPolicies);
    const role = await dbconnection('roles')
      .select('type')
      .where('roles.id', roleId);
    const roleType = role.length > 0 ? role[0].type : null;

    logger.info(`RoleType For Update DcaUsers ${roleType}`);
    const dcaUser = await dbconnection('dca_users')
      .select('*')
      .where('userId', userId);
    logger.info('DCA users for Auto Update ', dcaUser);

    await dbconnection('dca_users').del().where({ userId });
    const dcaUsers = [];
    if (body.agencyCode !== undefined || roleType === 'dcaadmin') {
      await dbconnection('dca_users').del().where({ userId });
      if (roleType === 'dcaagency' && dcaUser[0].agencyCode !== body.agencyCode) {
        await dbconnection('dca_users').where('agencyCode', dcaUser[0].agencyCode)
          .update({
            agencyCode: body.agencyCode
          });
      }
      if (roleType === 'dcaagency' && body.agencyName !== undefined && dcaUser[0].agencyName !== body.agencyName) {
        await dbconnection('dca_users').where('parentUserId', userId)

          .update({
            agencyName: body.agencyName
          });
      }
      if (roleType === 'dcaagency' && body.agencyPIC !== undefined && dcaUser[0].agencyPIC !== body.agencyPIC) {
        await dbconnection('dca_users').where('parentUserId', userId)

          .update({
            agencyPIC: body.agencyPIC
          });
      }
      const agencyCode = body.agencyCode;
      const agencyName = body.agencyName !== undefined && body.agencyName ? body.agencyName : null;
      const agencyLimit = body.agencyLimit !== undefined && body.agencyLimit ? body.agencyLimit : null;
      const agencyPIC = body.agencyPIC !== undefined && body.agencyPIC ? body.agencyPIC : null;
      const employeeId = body.employeeId !== undefined && body.employeeId ? body.employeeId : null;
      const loginTime = body.loginTime !== undefined && body.loginTime ? body.loginTime : null;
      const logoutTime = body.logoutTime !== undefined && body.logoutTime ? body.logoutTime : null;
      const parentUserId = body.parentUserId !== undefined && body.parentUserId ? body.parentUserId : null;
      const createdBy = body.parentUserName ? body.parentUserName : '1';
      const creationDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      dcaUsers.push({ userId, agencyCode, agencyName, agencyLimit, agencyPIC, employeeId, loginTime, logoutTime, roleType, parentUserId, createdBy, creationDate });
      if (roleType && roleType === 'dcaagency') {
        if (dcaUser[0].loginTime !== null && dcaUser[0].logoutTime !== null) {
          logger.info(`unformatted login time ${dcaUser[0].loginTime}`);
          const loginTimefromDB = dcaUser[0].loginTime.split(':');
          loginTimefromDB.pop();
          const formattedLoginTime = loginTimefromDB.join(':');

          logger.info(`formatted login time  ${formattedLoginTime}`);
          const logoutTimefromDB = dcaUser[0].logoutTime.split(':');
          logoutTimefromDB.pop();
          const formattedLogoutTime = logoutTimefromDB.join(':');
          logger.info(`formatted logout time ${formattedLogoutTime}`);
          if (formattedLoginTime !== body.loginTime || formattedLogoutTime !== body.logoutTime) {
            logger.info('inside dcaagency login/logout autoupdate');
            await dbconnection('dca_users').where('agencyCode', body.agencyCode)
              .update({
                loginTime: body.loginTime,
                logoutTime: body.logoutTime
              });
          }
        }
      }

      await dbconnection('dca_users').insert(dcaUsers);
    }
    return true;
  } catch (error) {
    logger.error('Failed Update User Service: ', error);
    throw new Error('Agency Activity file not found to download.');
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};

exports.deleteUser = async (username, status) => {
  return new Promise((resolve, reject) => {
    // status = 0 inactive, 1 active
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .update({ isActive: status === 'true' ? 1 : 0 })
      .where('username', username)
      .then((success) => {
        logger.info('Delete User Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: `User has been successfully ${
              status === 'true' ? 'enabled' : 'disabled'
            }`
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Delete User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.dcaDisableGroupUser = async (username, status) => {
  return new Promise((resolve, reject) => {
    // status = 0 inactive, 1 active
    const dbconnection = GetSyncDBConnection();
    const isActive = status === 'true' ? 1 : 0;
    dbconnection.raw(
    `update users set isActive = ${isActive}
    where username in (
      select username from (
    select username from users inner join dca_users on dca_users.userId = users.id where users.username = '${username}' or parentUserId = (select id from users where username = '${username}')
      ) as t
    )
    `)
      .then((success) => {
        logger.info('Delete User Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: `User has been successfully ${
              status === 'true' ? 'enabled' : 'disabled'
            }`
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Delete User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.softDeleteUser = (username) => {
  return new Promise((resolve, reject) => {
    const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
    const dbconnection = GetSyncDBConnection();
    dbconnection('dca_users').select('roleType', 'users.id', 'userId')
      .innerJoin('users', 'dca_users.userId', 'users.id')
      .where('username', username).then(data => {
        dbconnection('users').innerJoin('dca_users', 'dca_users.userId', 'users.id').update({ deletedAt: now, userDeletedAt: now })
          .where('users.id', data[0].id)
          .then((success) => {
            logger.info('Delete User Service Response:', success);
            resolve([data[0].roleType, data[0].userId]);
          });
      })
      .catch((error) => {
        logger.error('Failed Delete User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.softDeletedDcaUser = (username, userId) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
    dbconnection('dca_users').innerJoin('users', 'dca_users.userId', 'users.id')
      .update({ deletedAt: now, userDeletedAt: now })
      .where('dca_users.parentUserId', userId)
      .then((success) => {
        logger.info('Delete DCA User Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'DCA User has been delete successfully '
          }
        };
        resolve(response);
      }).catch((error) => {
        logger.error('Failed Delete DCA User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
exports.checkUsernameAvailability = async (username) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .where('username', username)
      .then((data) => {
        logger.info('Check Username Availability Service Response:', data);
        const isAvailable = !(data.length > 0);
        const response = {
          resultcode: successCode,
          body: {
            isAvailable
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Check Username Availability Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.forgetPassword = async (username) => {
  const emailParams = {};
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .where('username', username)
      .then((data) => {
        const isAvailable = (data.length > 0);
        if (!isAvailable) {
          throw new Error('Username does not exist');
        } else {
          const verifyCode = Array(5)
            .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
            .map(function (x) {
              return x[Math.floor(Math.random() * x.length)];
            })
            .join('');
          emailParams.body = `Your username is ${username} and verification code is ${verifyCode}`;
          emailParams.subject = 'Your verification code for reset password';
          emailParams.email = [data[0].email];
          const veriExpiers = moment().add(30, 'minute').tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');

          dbconnection('users').where({ username }).update({
            verifyCode: bcrypt.hashSync(verifyCode, 10),
            verifyCodeExp: veriExpiers
          }).then(async (data) => {
            try {
              await sendMail(emailParams);
            } catch (err) {
              console.log(err, 'erradasd');
              reject(err);
            }
            const response = {
              resultcode: successCode,
              body: {
                message: 'Verification code sent on your email'
              }
            };
            resolve(response);
          }).catch(err => {
            reject(err);
          });
        }
      })
      .catch((error) => {
        logger.error('Failed forget password verification code Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.checkEmailAvailability = async (email) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .where('email', email)
      .then((data) => {
        logger.info('Check Email Availability Service Response:', data);
        const isAvailable = !(data.length > 0);
        const response = {
          resultcode: successCode,
          body: {
            isAvailable
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Check EmailAvailability Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.getUser = async (username) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .where({ username })
      .then((user) => {
        logger.info('Get User Service Response:', user);
        resolve(user[0]);
      })
      .catch((error) => {
        logger.error('Failed Get User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

// Get user group id's and policy id's
exports.getUserGroupIds = async (userId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    const groupIds = [];

    dbconnection('user_groups')
      .select('user_groups.userGroupId')
      .where('user_groups.userId', userId)
      .then((groups) => {
        logger.info('Get Groups byId Service Response:', groups);
        for (let i = 0; i < groups.length; i++) {
          groupIds.push(groups[i].userGroupId);
        }
        resolve(groupIds);
      })
      .catch((error) => {
        logger.error('Failed User GroupIds Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.getUserPolicyIds = async (userId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    const policyIds = [];

    dbconnection('user_policies')
      .select('user_policies.policyId')
      .where('user_policies.userId', userId)
      .then((policies) => {
        logger.info('Get User PolicyIds Service Response:', policies);
        for (let i = 0; i < policies.length; i++) {
          policyIds.push(policies[i].policyId);
        }
        resolve(policyIds);
      })
      .catch((error) => {
        logger.error('Failed Get User PolicyIds Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.getParentUserId = async (parentUserName) => {
  return new Promise((resolve, reject) => {
    // status = 0 inactive, 1 active
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .where('username', parentUserName)
      .then((user) => {
        resolve(user[0]);
      })
      .catch((error) => {
        logger.error('Failed to get users data User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.login = async (body) => {
  return new Promise((resolve, reject) => {
    const { username, password, isMobile } = body;
    const dbconnection = GetSyncDBConnection();

    console.log('Auth login user isMobile:', isMobile);
    if ( isMobile === true) {
      console.log('isMobile-------------: ', isMobile);

    } else {
      console.log('isMobile-------------: ', isMobile);

    }
    dbconnection('users').where('username', username).innerJoin('roles', 'roles.id', 'users.roleId').then(data => {
      if (!data[0]) { throw new Error('User does not exist.'); }
      if (!data[0].isActive) { throw new Error('User is not active'); }
      if (!data[0].password) { throw new Error('Password is not found in system'); }
      const returnData = {};
      if (data[0].forceReset) { returnData.passwordChangeRequired = true; }
      console.log('decryptPassword-------------: ', password);


      if(isMobile === true){
        if( password === data[0].password) {

          const token = jwt.sign({ userId: data[0].id, username: data[0].username, 'custom:role': data[0].roleId, email: data[0].email }, process.env.JWT_ENCRYPTION, { expiresIn: process.env.JWT_EXPIRATION });
          const refreshToken = jwt.sign({ userId: data[0].id, username: data[0].username, 'custom:role': data[0].roleId, email: data[0].email }, process.env.JWT_ENCRYPTION, { expiresIn: process.env.REFRESH_EXPIRATON });
          returnData.idToken = token;
          returnData.refreshToken = refreshToken;
          console.log('decryptPassword returnData-------------: ', returnData);
          resolve(returnData);
        } else { throw new Error('Incorrect username or password.'); }
      } else {
        bcrypt.compare(decryptPassword(password), data[0].password).then(function (result) {
          if (result === true) {
            const token = jwt.sign({ userId: data[0].id, username: data[0].username, 'custom:role': data[0].roleId, email: data[0].email }, process.env.JWT_ENCRYPTION, { expiresIn: process.env.JWT_EXPIRATION });
            const refreshToken = jwt.sign({ userId: data[0].id, username: data[0].username, 'custom:role': data[0].roleId, email: data[0].email }, process.env.JWT_ENCRYPTION, { expiresIn: process.env.REFRESH_EXPIRATON });
            returnData.idToken = token;
            returnData.refreshToken = refreshToken;
            console.log('decryptPassword returnData-------------: ', returnData);

            resolve(returnData);
          } else { throw new Error('Incorrect username or password.'); }
        }).catch((err) => {
          logger.error('Login Failed: ', err);
          reject(err);
        });
      }


    })
      .catch((error) => {
        logger.error('Failed to get users data User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.collectPassword = async (body) => {
  const dbconnection = GetSyncDBConnection();
  try {
    const { username, password } = body;
    const decryptedPassword = bcrypt.hashSync(decryptPassword(password), 10);
    await dbconnection('users').where({ username }).update({
      password: decryptedPassword, forceReset: 0
    });
    return true;
  } catch (error) {
    logger.error('Failed Update User Service: ', error);
    return false;
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};

exports.getUserList = async (params) => {
  const dbconnection = GetSyncDBConnection();
  let query;
  if (params.field && params.value) {
    let field = params.field;
    const value = params.value;
    const UserAttributes = [
      {
        Name: 'given_name',
        Value: 'firstName'
      },
      {
        Name: 'family_name',
        Value: 'lastName'
      },
      {
        Name: 'email',
        Value: 'email'
      },
      {
        Name: 'username',
        Value: 'username'
      }
    ];
    field = UserAttributes.find(element => element.Name === field);

    query = dbconnection('users').select('id', 'firstName', 'roleId', 'lastName', 'forceReset', 'contactNumber', 'email', 'creationDate', 'updationDate', 'createdBy', 'isActive', 'username', 'notes').where(field.Value, 'like', '%' + value + '%').orderBy('isActive', 'desc');
  } else {
    query = dbconnection('users').select('id', 'firstName', 'roleId', 'forceReset', 'lastName', 'contactNumber', 'email', 'creationDate', 'updationDate', 'createdBy', 'isActive', 'username', 'notes').orderBy('isActive', 'desc');
  }
  return new Promise((resolve, reject) => {
    query.then((user) => {
      // logger.info('Get User Service Response:', user);
      user = user.map(data => {
        data.enabled = data.isActive === 1;
        data.status = data.forceReset ? 'FORCE_CHANGE_PASSWORD' : 'CONFIRMED';
        return data;
      });
      resolve(user);
    })
      .catch((error) => {
        logger.error('Failed Get User Service: ', error);
        reject(error);
      }).finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.getRoleType = async (username) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('roles')
      .select('type')
      .innerJoin('users', 'users.roleId', 'roles.id')
      .where('users.username', username)
      .then((roleType) => {
        resolve(roleType[0]);
      })
      .catch((error) => {
        logger.error('Failed to get role Type User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.getDcaList = async (params, userId) => {
  // userList.roleType = userList.roleType === 'dcaagency' ? 'Agency' : userList.roleType === 'dcauser' ? 'Agent' : userList.roleType === 'dcaadmin' ? 'Admin' : userList.roleType;
  const dbconnection = GetSyncDBConnection();
  let query;
  if (params.field && params.value) {
    let field = params.field;
    const value = params.value;
    const UserAttributes = [
      {
        Name: 'given_name',
        Value: 'firstName'
      },
      {
        Name: 'family_name',
        Value: 'lastName'
      },
      {
        Name: 'email',
        Value: 'email'
      },
      {
        Name: 'username',
        Value: 'username'
      }
    ];
    field = UserAttributes.find(element => element.Name === field);
    query = dbconnection('dca_users').select('roleType', 'logoutTime', 'loginTime', 'employeeId', 'agencyPIC', 'agencyName', 'agencyLimit', 'agencyCode', 'firstName', 'roleId', 'lastName', 'forceReset', 'contactNumber', 'email', 'users.creationDate', 'users.updationDate', 'users.createdBy', 'isActive', 'username', 'notes', 'parentUserId', 'userDeletedAt').where(field.Value, 'like', '%' + value + '%').havingNull('userDeletedAt').innerJoin('users', 'users.id', 'dca_users.userId').orderBy('isActive', 'desc');
  } else {
    query = dbconnection('dca_users').select('roleType', 'logoutTime', 'loginTime', 'employeeId', 'agencyPIC', 'agencyName', 'agencyLimit', 'agencyCode', 'firstName', 'roleId', 'forceReset', 'lastName', 'contactNumber', 'email', 'users.creationDate', 'users.updationDate', 'users.createdBy', 'isActive', 'username', 'notes', 'parentUserId', 'userDeletedAt').innerJoin('users', 'users.id', 'dca_users.userId').havingNull('userDeletedAt').orderBy('isActive', 'desc');
  }
  return new Promise((resolve, reject) => {
    query.then((user) => {
      // logger.info('Get User Service Response:', user);
      user = user.map(data => {
        data.enabled = data.isActive === '1';
        data.status = data.forceReset ? 'FORCE_CHANGE_PASSWORD' : 'CONFIRMED';
        data.roleType = data.roleType === 'dcaagency' ? 'Agency' : data.roleType === 'dcauser' ? 'Agent' : data.roleType === 'dcaadmin' ? 'Admin' : data.roleType;
        return data;
      });
      resolve(user);
    })
      .catch((error) => {
        logger.error('Failed Get User Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.getDcaAdminList = async (params, userId, agencyCode) => {
  const dbconnection = GetSyncDBConnection();
  let query;
  if (params.field && params.value) {
    let field = params.field;
    const value = params.value;
    const UserAttributes = [
      {
        Name: 'given_name',
        Value: 'firstName'
      },
      {
        Name: 'family_name',
        Value: 'lastName'
      },
      {
        Name: 'email',
        Value: 'email'
      },
      {
        Name: 'username',
        Value: 'username'
      }
    ];
    field = UserAttributes.find(element => element.Name === field);

    query = dbconnection('dca_users').select('roleType', 'logoutTime', 'loginTime', 'employeeId', 'agencyPIC', 'agencyName', 'agencyLimit', 'agencyCode', 'firstName', 'roleId', 'lastName', 'forceReset', 'contactNumber', 'email', 'users.creationDate', 'users.updationDate', 'users.createdBy', 'isActive', 'username', 'notes', 'parentUserId', 'userDeletedAt').where(field.Value, 'like', '%' + value + '%').andWhere({ agencyCode: agencyCode }).andWhere({ 'roles.type': 'dcauser' }).havingNull('userDeletedAt').innerJoin('users', 'users.id', 'dca_users.userId').innerJoin('roles', 'users.roleId', 'roles.id').orderBy('isActive', 'desc');
  } else {
    query = dbconnection('dca_users').select('roleType', 'logoutTime', 'loginTime', 'employeeId', 'agencyPIC', 'agencyName', 'agencyLimit', 'agencyCode', 'firstName', 'roleId', 'forceReset', 'lastName', 'contactNumber', 'email', 'users.creationDate', 'users.updationDate', 'users.createdBy', 'isActive', 'username', 'notes', 'parentUserId', 'userDeletedAt').where({ agencyCode: agencyCode }).andWhere({ 'roles.type': 'dcauser' }).havingNull('userDeletedAt').innerJoin('users', 'users.id', 'dca_users.userId').innerJoin('roles', 'users.roleId', 'roles.id').orderBy('isActive', 'desc');
  }
  return new Promise((resolve, reject) => {
    query.then((user) => {
      // logger.info('Get User Service Response:', user);
      user = user.map(data => {
        data.enabled = data.isActive === 1;
        data.status = data.forceReset ? 'FORCE_CHANGE_PASSWORD' : 'CONFIRMED';
        data.roleType = data.roleType === 'dcaagency' ? 'Agency' : data.roleType === 'dcauser' ? 'Agent' : data.roleType === 'dcaadmin' ? 'Admin' : data.roleType;
        return data;
      });
      resolve(user);
    })
      .catch((error) => {
        logger.error('Failed Get User Service: ', error);
      });
  });
};

exports.userLists = async () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .select('username')
      .then((data) => {
        logger.info('User Lists Service Response:', data);
        data = data.map(el => {
          return el.username;
        });
        const response = {
          resultcode: successCode,
          body: {
            data
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed to retrive User Lists Service Response: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.confirmForgotPassword = async function (body) {
  return new Promise((resolve, reject) => {
    const { username, confirmationCode, password } = body;
    const decryptedPassword = decryptPassword(password);
    const dbconnection = GetSyncDBConnection();
    dbconnection('users').where('username', username).then(async (data) => {
      if (data.length >= 1) {
        bcrypt.compare(confirmationCode, data[0].verifyCode).then(result => {
          if (!result) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: 'Invalid Verification Code' });
          } else {
            let veriCodeExpire = moment(data[0].verifyCodeExp).format('YYYY-MM-DD HH:mm:ss');
            let now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
            now = moment.utc(now);
            veriCodeExpire = moment.utc(veriCodeExpire);
            if (now.isBefore(veriCodeExpire)) {
              dbconnection('users')
                .update({ password: bcrypt.hashSync(decryptedPassword, 10), forceReset: 0, verifyCode: null, verifyCodeExp: null })
                .where('username', username).then(x => {
                  resolve(true);
                })
                .catch(error => {
                  logger.error('Failed Verification Code: ', error);
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject({ message: error });
                });
            } else {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject({ message: 'Verification code is expired' });
            }
          }
        });
      } else {
        // eslint-disable-next-line prefer-promise-reject-errors
        reject({ message: 'Invalid Username' });
      }
    }).catch((error) => {
      logger.error('Failed Verification Code: ', error);
      // eslint-disable-next-line prefer-promise-reject-errors
      reject({ message: error });
    });
  });
};

exports.collectPassword = async (body) => {
  const dbconnection = GetSyncDBConnection();
  try {
    const { username, password } = body;
    const encryptedPassword = password;
    const decryptedPassword = bcrypt.hashSync(decryptPassword(password), 10);
    await dbconnection('users').where({ username }).update({
      password: decryptedPassword,
      forceReset: 0,
      encryptedPassword: encryptedPassword
    });
    return true;
  } catch (error) {
    logger.error('Failed Update User Service: ', error);
    return false;
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};

exports.createUser = async (body, username) => {
  const dbconnection = GetSyncDBConnection();
  const currentUser = username;
  const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    let transaction;
    const {
      // parentUserId,
      firstName,
      lastName,
      roleId,
      selectedGroups,
      selectedPolicies,
      email,
      contactNumber,
      notes
      // reportingManagerEmail,
      // resourceType
    } = body;
    const username = body.username.toLowerCase();
    const notesData = isStringBlank(notes) ? '-' : notes;
    const createdBy = currentUser;
    const updatedBy = currentUser;
    // const agencyInfo = body.agencyInfo;
    let agencyId;
    let userId;
    const userGroups = [];
    const userPolicies = [];
    const emailParams = {};
    const tempPswd = Array(10)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map(function (x) {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
    emailParams.body = `Your username is ${username} and temporary password is ${tempPswd}`;
    emailParams.subject = 'Your Temporary Password';
    emailParams.email = [email];
    dbconnection.transaction((trx) => {
      transaction = trx;
      return new Promise((resolve, reject) => {
        dbconnection('users').insert({
          firstName,
          lastName,
          contactNumber,
          email,
          username,
          roleId,
          isActive: true,
          isDeleted: 'N',
          // parentUserId,
          password: bcrypt.hashSync(tempPswd, 10),
          // reportingManager: body.reportingManager ? body.reportingManager : null,
          // reportingLocation: body.reportingLocation ? body.reportingLocation : null,
          // loginTime: body.loginTime ? body.loginTime : null,
          // logoutTime: body.logoutTime ? body.logoutTime : null,
          // agencyId: body.agencyId ? body.agencyId : null,
          // agencyPIC: body.agencyPIC ? body.agencyPIC : null,
          // employeeId: body.employeeId ? body.employeeId : null,
          createdBy,
          creationDate: now,
          updatedBy,
          updationDate: now,
          forceReset: 1,
          notes: notesData,
          gender: body.gender ? body.gender : "Male" ,
          age: body.age ? body.age : 00,
          dob: body.dob ? body.dob : "1990-01-01"
          // reportingManagerEmail,
          // resourceType
        }).transacting(transaction)
          .then(async (user) => {
            userId = user[0];
            console.log("userId..............: "+userId);
            // logger.info('agency Info Obj', agencyInfo);
            // if (agencyInfo && Object.keys(agencyInfo).length) {
            //   logger.info('agency Info Obj...!', agencyInfo);
            //   const agencyObj = await dbconnection('tex_gencies').where({ agencyCode: agencyInfo.agencyCode }).transacting(transaction);
            //   if (agencyObj && agencyObj.length) {
            //     return [agencyObj[0].id];
            //   } else {
            //     agencyInfo.agencyCode = agencyInfo.agencyCode.toUpperCase();
            //     return dbconnection('tex_agencies').insert(agencyInfo).transacting(transaction);
            //   }
            // }
            return [];
          })
          // .then((userAgencyInfo) => {
          //   agencyId = userAgencyInfo[0];
          //   logger.info(`agency details created from service for  userid ${userId}`, userAgencyInfo);
          //   if (agencyId) {
          //     return dbconnection('users').where({ id: userId }).update({ agencyId }).transacting(transaction);
          //   }
          //   return [];
          // })
          // .then((user) => {
          //   logger.info(`user agency details updated from service for  userid ${userId}`, user);
          //   selectedGroups.forEach((group) =>
          //     userGroups.push({ userId, userGroupId: parseInt(group) })
          //   );
          //   return dbconnection('user_groups').insert(userGroups).transacting(transaction);
          // })
          // .then((userGroupsResult) => {
          //   logger.info(`user groups created from service for  userid ${userId}`, userGroupsResult);
          //   selectedPolicies.forEach((policy) =>
          //     userPolicies.push({ userId, policyId: parseInt(policy) })
          //   );
          //   return dbconnection('user_policies').insert(userPolicies).transacting(transaction);
          // })
          // .then((userPoliciesResult) => {
          .then((user) => {

            userId2 = user[0];
            // logger.info(`user policies created from service for  userid ${userId}`, userPoliciesResult);
            logger.info(`User creation successful ${userId2}`);
            // return sendMail(emailParams);
          })
          .then(async (emailResponse) => {
            // logger.info(`Email sent for ${userId}`, emailResponse);
            logger.info(`emailResponse..........: ${userId}`);

            resolve(userId);
          })
          .catch((error) => {
            logger.info('user creation error', error);
            reject(error);
          });
      });
    })
      .then((userPoliciesResult) => {
        // logger.info(`user policies created from service for  userid ${userId}`, userPoliciesResult);
        transaction.commit();
        logger.info(`User creation successful ${userId}`);
        const response = {
          resultcode: successCode,
          body: {
            message: 'User creation successful..!!'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.info('user creation error', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.editUser = async (body, username, currentUser) => {
  const dbconnection = GetSyncDBConnection();
  //= ========Auto update of email=================//
  const role = await dbconnection('roles')
    .select('type')
    .where('roles.id', body.roleId);
  const roleType = role.length > 0 ? role[0].type : null;

  logger.info(`RoleType For Update DcaUsers ${roleType}`);
  const user = await dbconnection
    .select('*')
    .from('users')
    .where({ username });
  logger.info(`user email and updated email ${user[0].email} & ${body.email}`);
  if (roleType === 'dca-agency' && user[0].email !== body.email) {
    await dbconnection('users').where('parentUserId', user[0].id)
      .update({
        email: body.email
      });
  }

  //= ============================================//
  const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    let transaction;
    let userId = body.id;

    delete body.userId;

    dbconnection.transaction((trx) => {
      transaction = trx;
      let groups = body.selectedGroups;
      let policies = body.selectedPolicies;
      delete body.selectedGroups;
      delete body.selectedPolicies;
      const agencyInfo = body.agencyInfo;
      delete body.agencyInfo;
      const agencyId = body.agencyId;
      body.notes = isStringBlank(body.notes) ? '-' : body.notes;
      body.updatedBy = currentUser;
      body.updationDate = now;

      return new Promise((resolve, reject) => {
        dbconnection('users').where({ username }).update(body).transacting(transaction)
          .then(async (userResult) => {
            logger.info('Success: User update done', userResult);
            return dbconnection
              .select('*')
              .from('users')
              .where({ username }).transacting(transaction);
          })
          .then(async (user) => {
            logger.info('Success: User Details Fetch', user);
            userId = user[0].id;
            if (agencyInfo && Object.keys(agencyInfo).length) {
              if (agencyId === agencyInfo.id) {
                //= ===========Auto update feature==================//
                const role = await dbconnection('roles')
                  .select('type')
                  .where('roles.id', body.roleId);
                const roleType = role.length > 0 ? role[0].type : null;

                logger.info(`RoleType For Update DcaUsers ${roleType}`);
                const dcaUser = await dbconnection('tex_agencies')
                  .select('*')
                  .where('id', agencyId);
                logger.info('DCA users for Auto Update ', dcaUser);
                if (roleType === 'dca-agency' && user[0].email !== body.email) {
                  await dbconnection('users').where('parentUserId', userId)
                    .update({
                      email: body.email
                    });
                }

                if (roleType && roleType === 'dca-agency') {
                  const userDetails = await dbconnection('users')
                    .select('*')
                    .where('agencyId', agencyId);
                  if (userDetails[0].loginTime !== null && userDetails[0].logoutTime !== null) {
                    logger.info(`unformatted login time ${userDetails[0].loginTime}`);
                    const loginTimefromDB = userDetails[0].loginTime.split(':');
                    loginTimefromDB.pop();
                    const formattedLoginTime = loginTimefromDB.join(':');

                    logger.info(`formatted login time  ${formattedLoginTime}`);
                    const logoutTimefromDB = userDetails[0].logoutTime.split(':');
                    logoutTimefromDB.pop();
                    const formattedLogoutTime = logoutTimefromDB.join(':');
                    logger.info(`formatted logout time ${formattedLogoutTime}`);
                    if (formattedLoginTime !== body.loginTime || formattedLogoutTime !== body.logoutTime) {
                      logger.info('inside dcaagency login/logout autoupdate');
                      await dbconnection('users').innerJoin('tex_agencies', 'tex_agencies.id', 'users.agencyId')
                        .update({
                          loginTime: body.loginTime,
                          logoutTime: body.logoutTime
                        }).where('agencyCode', body.agencyCode);
                    }
                  }
                }

                //= ================================================//
                delete agencyInfo.id;
                return dbconnection('tex_agencies').where({ id: agencyId }).update(agencyInfo).transacting(transaction);
              } else {
                return [];
              }
            } else {
              return [];
            }
          })
          .then(async (agencyInfoResult) => {
            logger.info('Success: Agency Info update done.', agencyInfoResult);
            if (groups && groups.length) {
              groups = groups.map((userGroup) => {
                return { userGroupId: userGroup, userId };
              });
              await dbconnection('user_groups').del().where({ userId }).transacting(transaction);
              return dbconnection('user_groups').insert(groups).transacting(transaction);
            } else {
              return [];
            }
          })
          .then(async (userGroupsResult) => {
            logger.info('Groups updated for the user..!', userGroupsResult);
            if (policies && policies.length) {
              policies = policies.map((userPolicy) => {
                return { policyId: userPolicy, userId };
              });
              await dbconnection('user_policies').del().where({ userId }).transacting(transaction);
              return dbconnection('user_policies').insert(policies).transacting(transaction);
            } else {
              return [];
            }
          })
          .then((userPoliciesResult) => {
            logger.info('Policies updated for the user..!', userPoliciesResult);
            resolve(userId);
          })
          .catch((error) => {
            logger.info('user updation error', error);
            reject(error);
          });
      });
    })
      .then((userResult) => {
        logger.info('update user from service for  userid', userResult);
        transaction.commit();
        logger.info('Success: User update successful.');
        const response = {
          resultcode: successCode,
          body: {
            message: 'User update successful..!'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.info('Error: User update error', error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.editEndUser = async (body, username, currentUser) => {
  const dbconnection = GetSyncDBConnection();
  // const user = await dbconnection
  //   .select('*')
  //   .from('users')
  //   .where({ username });
  // logger.info(`user email and updated email ${user[0].email} & ${body.email}`);

  logger.info(`Updating user for the username:  ${username}`);


  //= ============================================//
  const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    let transaction;
    let userId = body.id;

    delete body.userId;

    dbconnection.transaction((trx) => {
      transaction = trx;
      body.firstName = body.firstName;
      body.lastName = body.lastName;
      body.contactNumber = body.contactNumber;
      body.gender = body.gender;
      body.age = body.age;
      body.dob = body.dob;
      body.updatedBy = currentUser;
      body.updationDate = now;

      return new Promise((resolve, reject) => {
        dbconnection('users').where({ username }).update(body).transacting(transaction)
          .then(async (userResult) => {
            logger.info('Success: User update done', userResult);
            return dbconnection
              .select('*')
              .from('users')
              .where({ username }).transacting(transaction);
          })
          .then(async (user) => {
            logger.info('Success: User Details Fetch', user);
            userId = user[0].id;
            resolve(userId);
          })
          .catch((error) => {
            logger.info('user updation error', error);
            reject(error);
          });
      });
    })
      .then((userResult) => {
        logger.info('update user from service for  userid', userResult);
        transaction.commit();
        logger.info('Success: User update successful.');
        const response = {
          resultcode: successCode,
          body: {
            message: 'User update successful..!'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.info('Error: User update error', error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};


const getUserInfo = async (paramsObj, queryObj) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    queryObj.isActive = 1;
    queryObj.isDeleted = 'N';
    dbconnection.transaction((trx) => {
      transaction = trx;
      return dbconnection
        .select('users.id',
          'users.firstName',
          'users.lastName',
          'users.username',
          'users.email',
          'users.contactNumber',
          'users.roleId',
          'users.parentUserId',
          'users.agencyId',
          'users.reportingManager',
          'users.reportingManagerEmail',
          'users.reportingLocation',
          'users.resourceType',
          'users.employeeId',
          dbconnection.raw('IFNULL(tex_agencies.loginTime, users.loginTime) as loginTime'),
          dbconnection.raw('IFNULL(tex_agencies.logoutTime, users.logoutTime) as logoutTime'),
          'users.isActive ',
          'users.isDeleted',
          'users.userDeletedAt',
          'tex_agencies.agencyCode',
          'tex_agencies.agencyName',
          dbconnection.raw('IFNULL(users.agencyPIC, tex_agencies.agencyPIC) as agencyPIC'),
          'tex_gencies.agencyLimit'
        )
        .from('users')
        .leftJoin('tex_agencies', 'tex_agencies.id', 'users.agencyId')
        .where(queryObj).transacting(transaction);
    })
      .then((users) => {
        logger.info('Get User Service Response:', users);
        transaction.commit();
        resolve(users);
      })
      .catch((error) => {
        logger.error('Failed Get User Service: ', error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.fetchUser = getUserInfo;

const fetchParentUserQuery = (queryObj) => {
  const query = `SELECT
    _id,
    previous,
    level,
    childUserId,
    r.*
    FROM users r
    JOIN (
    SELECT
    @parent AS _id,
    @previous := @parent AS previous,
    @lvl := @lvl + 1 AS level,
    IFNULL(
      (
        SELECT @parent := parentUserId
        FROM users
        WHERE id = _id
      ),
      @parent := -1
    ) AS childUserId
    FROM users,
    (SELECT @parent := id,
      @lvl := 0,
          @previous = 0
      FROM users
      WHERE
      username = '${queryObj.username}'
    ) vars
    WHERE @parent != -1
    ) children ON children._id = r.id
    AND r.isActive = 1
    AND r.isDeleted = 'N'`;

  return query;
};

exports.fetchParentUsersDetails = (paramsObj, queryObj) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    dbconnection.transaction((trx) => {
      transaction = trx;
      const parentUserQuery = fetchParentUserQuery(paramsObj);
      return dbconnection.raw(parentUserQuery).transacting(transaction);
    })
      .then((parentUsers) => {
        logger.info('fetchParentUsersDetails Service Response:', parentUsers);
        transaction.commit();
        resolve(parentUsers[0]);
      })
      .catch((error) => {
        logger.error('Failed fetchParentUsersDetails Service : ', error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.setUserStatus = (req, body) => {
  const paramsObj = req.params;
  const dbconnection = GetSyncDBConnection();
  const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    let transaction;
    const username = paramsObj.username;
    const status = paramsObj.status;
    if (status === 'delete') {
      // body.isDeleted = body.isDeleted;
      body.userDeletedAt = now;
      // User has to be disabled during delete.
      body.isActive = 0;
      body.updationDate = now;
      body.updatedBy = req.body.auditLog.userId;
    }

    if (status === 'enable' || status === 'disable') {
      body.isActive = parseInt(body.isActive);
      body.updationDate = now;
      body.updatedBy = req.body.auditLog.userId;
    }
    dbconnection.transaction((trx) => {
      transaction = trx;
      return new Promise((resolve, reject) => {
        dbconnection('users').where({ username }).update(body).transacting(transaction)
          .then((user) => {
            logger.info(`User ${status} done: ${username}`, user);
            const userInfoQuery = getUserInfoQuery({ username });
            return dbconnection.raw(userInfoQuery).transacting(transaction);
          })
          .then((userInfoObj) => {
            if (userInfoObj && userInfoObj[0].length) {
              userInfoObj = userInfoObj[0][0];
              if (userInfoObj.business_unit === 'DCA' && (userInfoObj.user_type === 'AGENT_ADMIN' || userInfoObj.user_type === 'ASTRO_ADMIN')) {
                return dbconnection('users').where({ parentUserId: userInfoObj.id }).update(body).transacting(transaction);
              } else {
                return [];
              }
            }
          })
          .then((userUpdateObj) => {
            logger.info(`Users ${status} done: ${username}`, userUpdateObj);
            resolve(username);
          })
          .catch((error) => {
            logger.error(`User ${status} update failure.`, error);
            reject(error);
          });
      });
    })
      .then((userResult) => {
        logger.info(`${status} user from service for  user ${username} successful.`, userResult);
        transaction.commit();
        logger.info(`Success: ${status} user from service for  user ${username}`);
        const response = {
          resultcode: successCode,
          body: {
            message: `User ${status} successful..!`
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error(`Error: User ${status} error`, error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

const getUserInfoQuery = (queryObj) => {
  const query = `SELECT
    u.id,
    u.firstName,
    u.lastName,
    u.username,
    u.email,
    u.contactNumber,
    u.roleId,
    r.type as roleType,
    r.name as roleName,
    ut.user_type,
    ut.user_type_name,
    u.parentUserId,
    u.profileImage,
    u.isFresher,
    u.username as parentUserName,
    u.agencyId,
    u.employeeId,
    IF (u.isActive = 1, true, false) as enabled,
    IF (u.isDeleted = 'N', false, true) as deleted,
    IF(u.forceReset = 1, 'FORCE_CHANGE_PASSWORD' , 'CONFIRMED' ) as status,
    u.forceReset,
    u.isActive,
    u.isDeleted,
    u.notes,
    u.createdBy,
    u.creationDate,
    u.updatedBy,
    u.updationDate,
    u.reportingManager,
    u.reportingManagerEmail,
    u.resourceType,
    u.reportingLocation,
    u.gender,
    u.age,
    u.dob
  FROM
    users u
      JOIN roles r on r.id = u.roleId
      JOIN tex_user_types ut on ut.id = r.user_type_id
  WHERE
    1 = 1 `;
    // and u.username = '${queryObj.username}'`;

  return query;
};

exports.getAllUsers = async () => {
  try {
      const dbconnection = await GetSyncDBConnection();
      const polls = await dbconnection.raw("SELECT *, (SELECT NULL) as 'encryptedPassword', (SELECT NULL) as 'password', (SELECT NULL) as 'verifyCode' FROM users").then((success) => {
          logger.info('Get all users:', success);
          return success[0]
      })
      const response = {
          resultcode: successCode,
          body: polls
      };
      await GetSyncDBDisconnection(dbconnection);
      return response
  } catch (err) {
      return err
  }
};

exports.getUserById = async (id) => {
  try {
      const dbconnection = await GetSyncDBConnection();
      const polls = await dbconnection.raw(`SELECT *, (SELECT NULL) as 'encryptedPassword', (SELECT NULL) as 'password', (SELECT NULL) as 'verifyCode' FROM users WHERE id=${id}`).then((success) => {
          logger.info('Get user:', success);
          return success[0]
      })
      const response = {
          resultcode: successCode,
          body: polls
      };
      await GetSyncDBDisconnection(dbconnection);
      return response
  } catch (err) {
      return err
  }
};




const getListUsersQuery = (queryObj, searchObj) => {
  const searchAttributes = {
    given_name: 'u.firstName',
    family_name: 'u.lastName',
    email: 'u.email',
    username: 'u.username',
    parentUserName: 'parent.username',
    reportingManager: 'u.reportingManager',
    createdBy: 'u.createdBy',
    reportingLocation: 'u.reportingLocation'
  };

  const searchField = searchAttributes[searchObj.field];
  const searchValue = searchObj.value;

  let query = `SELECT
    u.id,
    u.firstName,
    u.lastName,
    u.username,
    u.email,
    u.contactNumber,
    sr.business_unit,
    sr.business_unit_name,
    sr.roleId,
    sr.roleType,
    sr.roleName,
    sr.user_type,
    sr.user_type_name,
    u.parentUserId,
    u.employeeId,
    parent.username as parentUserName,
    u.agencyId,
    IF(sr.business_unit = 'DCA',
      CASE
        WHEN sr.user_type = 'ASTRO_ADMIN' THEN 'ADMIN'
        ELSE agency.agencyCode
      END ,
      IF(agency.agencyCode IS NULL, '-', agency.agencyCode)
    ) as agencyCode,
    IF(sr.business_unit = 'DCA',
      CASE
        WHEN sr.user_type = 'ASTRO_ADMIN' THEN 'Admin'
        ELSE agency.agencyName
      END ,
      IF(agency.agencyName IS NULL, '-', agency.agencyName)
    ) as agencyName,
    IFNULL(u.agencyPIC, agency.agencyPIC) as agencyPIC,
    IFNULL(agency.loginTime, u.loginTime) as loginTime,
    IFNULL(agency.logoutTime, u.logoutTime) as logoutTime,
    IF (u.isActive = 1, true, false) as enabled,
    IF (u.isActive = 1, 'True', 'False') as enabled_flag,
    IF(u.forceReset = 1, 'FORCE_CHANGE_PASSWORD' , 'CONFIRMED' ) as status,
    u.isActive,
    u.createdBy,
    u.notes,
    u.reportingManager,
    u.reportingManagerEmail,
    u.resourceType,
    u.reportingLocation
  FROM
    users u
    JOIN (
      SELECT
        r.id as roleId,
          r.type as roleType,
          r.name as roleName,
          ut.id as user_type_id,
          ut.user_type,
          ut.user_type_name,
          bu.id as business_unit_id,
          bu.business_unit,
          bu.business_unit_name
      FROM
        roles r
          JOIN tex_business_unit_user_types buut on buut.business_unit_id = r.business_unit_id and buut.user_type_id = r.user_type_id
          JOIN tex_user_types ut on ut.id = buut.user_type_id
          JOIN tex_business_units bu on bu.id = buut.business_unit_id
      WHERE
        1 = 1
          AND r.id = ${queryObj.roleId}
      UNION
      SELECT
        sr.user_role_id as roleId,
        r.type as roleType,
        r.name as roleName,
        ut.id as user_type_id,
        ut.user_type,
        ut.user_type_name,
        bu.id as business_unit_id,
        bu.business_unit,
        bu.business_unit_name
      FROM
        sub_roles sr
        JOIN roles r on r.id = sr.user_role_id
        JOIN tex_business_unit_user_types buut on buut.business_unit_id = r.business_unit_id and buut.user_type_id = r.user_type_id
        JOIN tex_user_types ut on buut.user_type_id = ut.id
        JOIN tex_business_units bu on bu.id = buut.business_unit_id
      WHERE
        1 = 1
        AND sr.admin_role_id = ${queryObj.roleId}
    ) as sr on sr.roleId = u.roleId
      LEFT JOIN tex_agencies agency on agency.id = u.agencyId
      LEFT JOIN users parent on parent.id = u.parentUserId
  WHERE
    1 = 1
    AND u.isDeleted = 'N' `;
  const businessUnitClause = `AND CASE
      WHEN '${queryObj.business_unit}' = 'ALL' THEN 1 = 1
      ELSE sr.business_unit = '${queryObj.business_unit}'
    END `;
  const agencyIdClause = `AND IF(
      'DCA' = '${queryObj.business_unit}' ,
      IF (${queryObj.agencyId} IS NULL AND '${queryObj.user_type}' = 'ASTRO_ADMIN', 1 = 1, u.agencyId = ${queryObj.agencyId}),
      1 = 1
    ) `;
  const astroAdminClause = ` AND CASE
    WHEN '${queryObj.user_type}' = 'ASTRO_ADMIN' THEN 1 = 1
    WHEN '${queryObj.user_type}' = 'SUPER_ADMIN' THEN 1 = 1
    WHEN '${queryObj.user_type}' = 'AGENT_ADMIN' AND '${queryObj.business_unit}' = 'DCA' THEN
    CASE WHEN '${queryObj.username}' = u.username THEN 1 = 1
      WHEN '${queryObj.username}' != u.username AND sr.user_type = 'AGENT_ADMIN' THEN 1 = 2
      ELSE u.agencyId = ${queryObj.agencyId} END
    WHEN '${queryObj.user_type}' = 'AGENT_ADMIN' AND '${queryObj.business_unit}' != 'DCA' THEN '${queryObj.username}' = u.username OR u.parentUserId = ${queryObj.id}
    ELSE 1 = 1
    END  `;
  //   ` AND CASE
  // WHEN '${queryObj.user_type}' = 'ASTRO_ADMIN' THEN 1 = 1
  // WHEN '${queryObj.user_type}' = 'SUPER_ADMIN' THEN 1 = 1
  // WHEN '${queryObj.user_type}' = 'AGENT_ADMIN' AND 'DCA' = '${queryObj.business_unit}' THEN u.agencyId = ${queryObj.agencyId}
  //   WHEN '${queryObj.user_type}' = 'AGENT_ADMIN' AND 'DCA' != '${queryObj.business_unit}' THEN '${queryObj.username}' = u.username OR u.parentUserId = ${queryObj.id}
  // ELSE 1 = 1
  // END `;
  const searchFieldClause = (searchField && searchValue) ? ` AND ${searchField} like '%${searchValue}%' ` : '';
  const orderbyClause = ` ORDER BY
    u.isActive DESC,
    sr.business_unit ASC`;

  query = query + businessUnitClause + agencyIdClause + astroAdminClause + searchFieldClause + orderbyClause;
  return query;
};

exports.listUsers = (req, username, downloadFlag) => { // downloadFlag will be true for only download userlist api
  const paramsObj = req.params;
  const queryObj = req.query;
  const currentUser = username;
  const dbconnection = GetSyncDBConnection();
  let userInfo = {};
  return new Promise((resolve, reject) => {
    let transaction;
    dbconnection.transaction((trx) => {
      transaction = trx;
      return new Promise((resolve, reject) => {
        const userInfoQuery = getUserInfoQuery({ username: currentUser });
        console.log("userInfoQuery........: "+userInfoQuery);

        dbconnection
          .raw(userInfoQuery).transacting(transaction)
          .then((currentUserDetails) => {
            logger.info('Current User Details Fetched', currentUserDetails[0].length);
            if (currentUserDetails && currentUserDetails.length) {
              resolve(currentUserDetails[0]);
            } else {
              resolve([]);
            };
            // if (currentUserDetails && currentUserDetails[0].length) {
            //   userInfo = currentUserDetails[0][0];
            //   const listUsersQuery = getListUsersQuery(userInfo, queryObj);
            //   console.log("listUsersQuery..................... "+listUsersQuery);
            //   logger.info('Consoller statements', {
            //     paramsObj,
            //     queryObj,
            //     userInfo
            //   });
            //   return dbconnection.raw(listUsersQuery).transacting(transaction);
            // };
            // return [];
          })
          // .then((listUserResult) => {
          //   logger.info('Success: List User Request: ', listUserResult);
          //   if (listUserResult && listUserResult.length) {
          //     resolve(listUserResult[0]);
          //   } else {
          //     resolve([]);
          //   };
          // })
          .catch((error) => {
            logger.error('Failure: List User Request: ', error);
            reject(error);
          });
      });
    })
      .then((users) => {
        logger.info('Success: List User Service Response:', users);
        transaction.commit();
        if (downloadFlag) {
          resolve({
            fields: getFieldsForCSVdownload(userInfo),
            users
          });
        } else {
          resolve(users);
        }
      })
      .catch((error) => {
        logger.error('Error: List User Service Error: ', error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

const getUserTypesQuery = (queryObj, currentUser) => {
  let query = `SELECT distinct ut.id, ut.user_type, ut.user_type_name FROM tex_user_types ut
    JOIN roles r ON r.user_type_id = ut.id
    JOIN users u ON u.roleId = r.id
  WHERE 1 = 1`;

  if (currentUser) {
    query += ` AND u.username = '${currentUser}' `;
  }

  if (queryObj.businessUnit) {
    query += ` AND bu.business_unit = '${queryObj.businessUnit}' `;
  };

  if (queryObj.userType) {
    query += ` AND ut.user_type = '${queryObj.userType}' `;
  };

  // if (queryObj.roleId) {
  //   query += ` AND r.id = ${queryObj.roleId} `;
  // };

  return query;
};

// Function call that authorizes the create or update operations.
const isAuthorizedUser = (req, res, mode) => {
  let username = '';
  const currentUser = res.locals.username;
  if (mode === 'create') {
    // username = (req.body && req.body.data) ? req.body.data.username : '';
    username = currentUser;
  };

  if (mode === 'update') {
    username = req.params ? req.params.username : '';
  };

  let userInfoObj = {};
  const userInfoQuery = getUserInfoQuery({ username });
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    dbconnection.transaction((trx) => {
      transaction = trx;
      logger.info('userInfoQuery ' + userInfoQuery);
      return new Promise((resolve, reject) => {
        dbconnection.raw(userInfoQuery).transacting(transaction)
          .then((userInfo) => {
            logger.info('userInfo', userInfo);
            logger.info('userInfoObj ', userInfoObj);
            logger.info('username ' + username);
            userInfoObj = userInfo[0][0];
            logger.info('userInfo', userInfo);
            let queryParamObj = {};
            console.log("mode:..........:  "+ mode)

            if (mode === 'create') {

              queryParamObj = {
                roleId: req.body.data.roleId
              };
              if (!queryParamObj.roleId) {
                console.log("case1:..........:  "+ mode)

                throw new Error(`Role Id is mandatory for ${mode} operation.`);
              }
              if (userInfoObj.business_unit !== 'DCA' && userInfoObj.user_type !== 'SUPER_ADMIN') {
                console.log("case2:..........:  "+ mode)

                throw new Error(`Unauthorized ${mode} operation.`);
              }
            } else if (mode === 'update') {
              queryParamObj = {
                businessUnit: userInfoObj.business_unit,
                userType: userInfoObj.user_type
              };
            } else {
              throw new Error(`Invalid ${mode} operation.`);
            }
            if (username && queryParamObj && Object.keys(queryParamObj).length) {
              const getValidUserTypesQuery = getUserTypesQuery(queryParamObj, currentUser); // Query to get the valid user types for the create/update operation.
              logger.info(`getValidUserTypesQuery: ${getValidUserTypesQuery}`);
              return dbconnection.raw(getValidUserTypesQuery).transacting(transaction);
            } else {
              throw new Error(`Invalid username provided for ${mode} operation.`);
            }
          })
          .then((validUserTypes) => {
            logger.info('Success: User Authorization Service Response:', validUserTypes);
            resolve(validUserTypes);
          })
          .catch((error) => {
            logger.error('Error: User Authorization Service Error: ', error);
            reject(error);
          });
      });
    })
      .then((validUserTypes) => {
        logger.info('Success: User Authorization Service Response:', validUserTypes);
        transaction.commit();
        if (validUserTypes[0] && validUserTypes[0].length) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        logger.error('Error: User Authorization Service Error: ', error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.isAuthorizedUser = isAuthorizedUser;

// Function call that authorizes the create or update operations.
const isAuthorizedEndUser = (req, res, mode) => {
  let username = '';
  const currentUser = res.locals.username;
  if (mode === 'create') {
    username = currentUser;
  };

  if (mode === 'update') {
    username = req.params ? req.params.username : '';
  };

  let userInfoObj = {};
  const userInfoQuery = getUserInfoQuery({ username });
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    dbconnection.transaction((trx) => {
      transaction = trx;
      logger.info('userInfoQuery ' + userInfoQuery);
      return new Promise((resolve, reject) => {
        dbconnection.raw(userInfoQuery).transacting(transaction)
          .then((userInfo) => {
            logger.info('userInfo', userInfo);
            logger.info('userInfoObj ', userInfoObj);
            logger.info('username ' + username);
            userInfoObj = userInfo[0][0];
            logger.info('userInfo', userInfo);
            let queryParamObj = {};
            console.log("mode:..........:  "+ mode)

              const getValidUserTypesQuery = getUserTypesQuery(queryParamObj, currentUser); // Query to get the valid user types for the create/update operation.
              logger.info(`getValidUserTypesQuery: ${getValidUserTypesQuery}`);
              return dbconnection.raw(getValidUserTypesQuery).transacting(transaction);

          })
          .then((validUserTypes) => {
            logger.info('Success: User Authorization Service Response:', validUserTypes);
            resolve(validUserTypes);
          })
          .catch((error) => {
            logger.error('Error: User Authorization Service Error: ', error);
            reject(error);
          });
      });
    })
      .then((validUserTypes) => {
        logger.info('Success: User Authorization Service Response:', validUserTypes);
        transaction.commit();
        if (validUserTypes[0] && validUserTypes[0].length) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        logger.error('Error: User Authorization Service Error: ', error);
        transaction.rollback();
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.isAuthorizedEndUser = isAuthorizedEndUser;

exports.adminResetPassword = async (body) => {
  try {
    const { username, password } = body;
    const decryptedPassword = decryptPassword(password);
    const dbconnection = GetSyncDBConnection();
    await dbconnection('users')
      .update({ password: bcrypt.hashSync(decryptedPassword, 10), forceReset: 1 })
      .where('username', username)
      .catch(error => {
        const res = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        throw new Error(res);
      });
  } catch (error) {
    const errors = {
      InvalidParameterException: 'Please enter valid data',
      InvalidPasswordException: 'The password entered is invalid',
      UserNotFoundException: 'Username does not exist',
      InternalErrorException: 'Internal Server Error'
    };
    throw new Error(errors[`${error.name}`] ? errors[`${error.name}`] : error);
  }
};

exports.signOut = (idToken) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('user_sessions')
      .where('idToken', idToken)
      .then((session) => {
        if (session.length > 0) {
          dbconnection('user_sessions')
            .update({ activeSession: 0 })
            .where('idToken', idToken)
            .then(success => {
              resolve({ signOut: true });
            })
            .catch(error => {
              const res = {
                resultcode: errorCode,
                body: {
                  data: error
                }
              };
              reject(res);
            });
        } else {
          resolve({ signOut: true });
        }
      })
      .catch((error) => {
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.changePassword = async function (body) {
  const dbconnection = GetSyncDBConnection();
  try {
    const { username, newPassword, password } = body;
    const decryptedNewPassword = decryptPassword(newPassword);
    await dbconnection('users').where('username', username).innerJoin('roles', 'roles.id', 'users.roleId').then(async data => {
      if (!data[0]) { throw new Error('User does not exist.'); }
      if (!data[0].isActive) { throw new Error('User is not active'); }
      if (!data[0].password) { throw new Error('Password is not found in system'); }
      await bcrypt.compare(decryptPassword(password), data[0].password).then(function (result) {
        if (result !== true) {
          throw new Error('Incorrect password.');
        }
      });
      await dbconnection('users')
        .update({ password: bcrypt.hashSync(decryptedNewPassword, 10), forceReset: 0 })
        .where('username', username)
        .catch(error => {
          const res = {
            resultcode: errorCode,
            body: {
              data: error
            }
          };
          throw new Error(res);
        });
    }).catch(error => {
      logger.error('user verified failed: ', error);
      throw new Error(error);
    });
    // await cognitoServiceProvider.adminSetUserPassword(params).promise();
    return true;
  } catch (error) {
    logger.error('change password service failed: ', error);
    throw new Error(error);
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};

const getFieldsForCSVdownload = (userInfo) => {
  const fields = [];
  const basicInfoFields = [{
    label: 'User Name',
    value: 'username',
    default: 'NULL'
  },
  {
    label: 'First Name',
    value: 'firstName',
    default: 'NULL'
  },
  {
    label: 'Last Name',
    value: 'lastName',
    default: 'NULL'
  },
  {
    label: 'Contact Number',
    value: 'contactNumber',
    default: 'NULL'
  },
  {
    label: 'Email',
    value: 'email',
    default: 'NULL'
  },
  {
    label: 'Role Type',
    value: 'roleType',
    default: 'NULL'
  },
  {
    label: 'Business Unit',
    value: 'business_unit_name',
    default: 'NULL'
  },
  {
    label: 'User Type',
    value: 'user_type_name',
    default: 'NULL'
  },
  {
    label: 'Parent User',
    value: 'parentUserName',
    default: 'NULL'
  }];
  const agencyFields = [{
    label: 'Agency Code',
    value: 'agencyCode',
    default: 'NULL'
  },
  {
    label: 'Agency Name',
    value: 'agencyName',
    default: 'NULL'
  },
  {
    label: 'Agency PIC',
    value: 'agencyPIC',
    default: 'NULL'
  }];
  const loginFields = [{
    label: 'Login Time',
    value: 'loginTime',
    default: 'NULL'
  },
  {
    label: 'Logout Time',
    value: 'logoutTime',
    default: 'NULL'
  }];
  const employeeIdField = [{
    label: 'Employee ID',
    value: 'employeeId',
    default: 'NULL'
  }];
  const additionalInfoFields = [{
    label: 'Created By',
    value: 'createdBy',
    default: 'NULL'
  },
  {
    label: 'Reporting Manager Network ID',
    value: 'reportingManager',
    default: 'NULL'
  },
  {
    label: 'Reporting Manager Email',
    value: 'reportingManagerEmail',
    default: 'NULL'
  },
  {
    label: 'Resource Type',
    value: 'resourceType',
    default: 'NULL'
  },
  {
    label: 'Location',
    value: 'reportingLocation',
    default: 'NULL'
  },
  {
    label: 'Status',
    value: 'status',
    default: 'NULL'
  },
  {
    label: 'Enabled',
    value: 'enabled_flag',
    default: 'NULL'
  }];

  fields.push(...basicInfoFields);
  if (userInfo.user_type === 'SUPER_ADMIN' || (userInfo.business_unit === 'DCA' && userInfo.user_type === 'ASTRO_ADMIN')) {
    fields.push(...agencyFields);
    fields.push(...employeeIdField);
  };

  if (userInfo.business_unit === 'DCA' && userInfo.user_type === 'ASTRO_ADMIN') {
    fields.push(...loginFields);
  }

  fields.push(...additionalInfoFields);

  return fields;
};

exports.registerUser = async (body, username) => {
  const dbconnection = GetSyncDBConnection();
  const currentUser = body.username;
  console.log('Create User currentUser:',  currentUser);
  const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
  var password = generateRandomNumber(1000, 9999);
  var number = body.contactNumber;
  var userEmail = body.email;
  const emailParams = {};
  console.log('Create User password:',  password);
  return new Promise((resolve, reject) => {
    dbconnection('users')
      .where('username', currentUser)
      .then((user) => {
        if(user.length !==0) {
          console.log(" user already exist with username: ", currentUser);
          dbconnection('users')
            .update({password})
            .where('username', currentUser)
            .then((success) => {
              console.log('udated user record by otp:', password);
              const response = {
                resultcode: successCode,
                body: {
                  data: success
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.error('udated user record by otp failed: ', error);
              const response = {
                resultcode: errorCode,
                body: {
                  data: error
                }
              };
              reject(response);
            })
            .finally(() => {
              GetSyncDBDisconnection(dbconnection);
            });
        } else {
          console.log(" Registering new user with username: ", currentUser);
          let transaction;
          const {
            firstName,
            lastName,
            roleId,
            selectedGroups,
            selectedPolicies,
            email,
            contactNumber,
            notes
          } = body;
          const username = body.username.toLowerCase();
          const notesData = isStringBlank(notes) ? '-' : notes;
          const createdBy = currentUser;
          const updatedBy = currentUser;
          let agencyId;
          let userId;
          const userGroups = [];
          const userPolicies = [];
          const tempPswd = Array(10)
            .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
            .map(function (x) {
              return x[Math.floor(Math.random() * x.length)];
            })
            .join('');
          // emailParams.body = `Your username is ${username} and temporary password is ${tempPswd}`;
          // emailParams.subject = 'Your Temporary Password';
          // emailParams.email = [email];
          dbconnection.transaction((trx) => {
            transaction = trx;
            return new Promise((resolve, reject) => {
              dbconnection('users').insert({
                firstName,
                lastName,
                contactNumber,
                email,
                username,
                roleId,
                isActive: true,
                isDeleted: 'N',
                password: password,
                createdBy,
                creationDate: now,
                updatedBy,
                updationDate: now,
                forceReset: 0,
                notes: notesData,
                gender: body.gender ? body.gender : "Male" ,
                age: body.age ? body.age : 00,
                dob: body.dob ? body.dob : "1990-01-01"
              }).transacting(transaction)
                .then(async (user) => {
                  userId = user[0];
                  console.log("userId..............: "+userId);
                  return [];
                })
                .then((user) => {

                  userId2 = user[0];
                  logger.info(`User register successful ${userId2}`);
                })
                .then(async (emailResponse) => {
                  logger.info(`emailResponse..........: ${userId}`);

                  resolve(userId);
                })
                .catch((error) => {
                  logger.info('user register error', error);
                  reject(error);
                });
            });
          })
            .then((userPoliciesResult) => {
              transaction.commit();
              logger.info(`User register successful ${userId}`);
              const response = {
                resultcode: successCode,
                body: {
                  message: 'User register successful..!!'
                }
              };
              resolve(response);
            })
            .catch((error) => {
              logger.info('user register error', error);
              transaction.rollback();
              reject(error);
            })
            .finally(() => {
              GetSyncDBDisconnection(dbconnection);
            });
        }
        console.log("isEmail: "+containsEmail(currentUser) );
        if (containsEmail(currentUser)) {
          emailParams.body = "Welcome to Tex! your mobile verification code is: " + password;
          emailParams.subject = 'Tex user OTP';
          emailParams.email = userEmail;
        }
        // sending OTP
        try {
          containsEmail(currentUser) ? sendMail(emailParams) : sendOTP(password, number);
        } catch (err) {
            console.log('err: ', err);
            reject(err);
        }
      })
      .catch((error) => {
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
function generateRandomNumber(min, max) {
   return Math.floor(Math.random()*(max-min)+min);
}

function containsEmail(str) {
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(str);
}

exports.editUserById = (id, body) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
      .update(body)
      .where({ id: id })
      .then((success) => {
        logger.info('Update Users Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Users has been successfully updated'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed update Users Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.uploadImage = (body) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
    .where('id',body.id)
      .update({
        profileImage:body.profileImage
      })
      .then((success) => {
        logger.info('Upload Image User Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Users has been successfully updated'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed update Users Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.updateProfile = (body) =>{
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
    .where('id',body.id)
      .update({
        ...body
      })
      .then((success) => {
        logger.info('Update User Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Users has been successfully updated'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed update Users Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
}

exports.markUserisFresher = (body) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('users')
    .where('id',body.id)
      .update({
        isFresher:body.isFresher
      })
      .then((success) => {
        logger.info('Upload Image User Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'Users has been successfully updated'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed update Users Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.profileShare = (artistId, sharedBy) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({artistId, sharedBy})
      .into('profile_share')
      .then((success) => {
        logger.info('Create profile-share Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: 'profile-share saved!!'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed profile-share Service: ', error);
        const response = {
          resultcode: errorCode,
          body: {
            data: error
          }
        };
        reject(response);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.profileLike = (artistId, likedBy, islike) => {
  return new Promise((resolve, reject) => {
    console.log("islike: ", islike);
    const dbconnection = GetSyncDBConnection();
    if (islike > 0) {
      console.log("Saving profile like");
      dbconnection
        .insert({artistId, likedBy})
        .into('profile_like')
        .then((success) => {
          logger.info('Create profile-like Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'profile-like saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed profile-like Service: ', error);
          const response = {
            resultcode: errorCode,
            body: {
              data: error
            }
          };
          reject(response);
        })
        .finally(() => {
          GetSyncDBDisconnection(dbconnection);
        });
    } else {
      console.log("Removing profile like");
      dbconnection('profile_like').del()
      .whereRaw('likedBy = ? and  artistId = ? ',[likedBy,artistId])
        .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'profile-like Removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed profile-like remove Service: ', error);
          const response = {
            resultcode: errorCode,
            body: {
              data: error
            }
          };
          reject(response);
        })
        .finally(() => {
          GetSyncDBDisconnection(dbconnection);
        });
    }


  });
};

exports.profileSave = (artistId, savedBy, isSave) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    console.log("isSaved: ", isSave);
    if (isSave > 0) {
      console.log("Saving profile save");
      dbconnection
        .insert({artistId, savedBy})
        .into('profile_save')
        .then((success) => {
          logger.info('Create profile save Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'profile save saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed profile-save Service: ', error);
          const response = {
            resultcode: errorCode,
            body: {
              data: error
            }
          };
          reject(response);
        })
        .finally(() => {
          GetSyncDBDisconnection(dbconnection);
        });
    } else {
      console.log("Removing profile save");
      dbconnection('profile_save').del()
      .whereRaw('savedBy = ? and  artistId = ? ',[savedBy,artistId])
      .then((success) => {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Saved profile removed!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed profile-remove Service: ', error);
          const response = {
            resultcode: errorCode,
            body: {
              data: error
            }
          };
          reject(response);
        })
        .finally(() => {
          GetSyncDBDisconnection(dbconnection);
        });
    }
  });
};

exports.profileView = (artistId, viewedBy) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      console.log("Saving avid saveTag");
      dbconnection
        .insert({artistId, viewedBy})
        .into('profile_view')
        .then((success) => {
          logger.info('profile_view save Response:', success);
          const response = {
            resultcode: successCode,
            body: {
              message: 'profile_view saved!!'
            }
          };
          resolve(response);
        })
        .catch((error) => {
          logger.error('Failed profile_view Service: ', error);
          const response = {
            resultcode: errorCode,
            body: {
              data: error
            }
          };
          reject(response);
        })
        .finally(() => {
          GetSyncDBDisconnection(dbconnection);
        });
  });
};

exports.profileCount = (artistId, userId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
      console.log("Saving avid saveTag");
      dbconnection
        .raw("SELECT x.likeCount, y.viewCount, a.saveCount, b.shareCount FROM"
        +" (SELECT count(*) as likeCount from profile_like where artistId ="+artistId+") as x,"
        +" (SELECT count(*) as viewCount  FROM profile_view where artistId ="+artistId+") as y, "
        +" (SELECT count(*) as saveCount  FROM profile_save where artistId ="+artistId+") as a, "
        +" (SELECT count(*) as shareCount  FROM profile_share where artistId ="+artistId+") as b")
        .then((success) => {
          logger.info('profileCount save Response-------------:', success[0][0]);
          dbconnection('profile_like').count('id').where('likedBy', userId).then((likeCount) => {
            success[0][0].isProfileLiked = likeCount[0]['count(`id`)'] > 0 ? 1 : 0;
            dbconnection('profile_save').count('id').where('savedBy', userId).then((saveCount) => {
              success[0][0].isProfileSaved = saveCount[0]['count(`id`)'] > 0 ? 1 : 0;
              dbconnection('profile_share').count('id').where('sharedBy', userId).then((shareCount) => {
                success[0][0].isProfileShared = shareCount[0]['count(`id`)'] > 0 ? 1 : 0;
                const response = {
                  resultcode: successCode,
                  body: {
                    data: success[0]
                  }
                };
                resolve(response);
              })
              .catch((error) => {
                logger.error('Failed profileCount Service: ', error);
                const response = {
                  resultcode: errorCode,
                  body: {
                    data: error
                  }
                };
                reject(response);
              })
              .finally(() => {
                GetSyncDBDisconnection(dbconnection);
              });
            });
          });
        });
  });
};
