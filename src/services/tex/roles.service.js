const {
  // GetDBConnection: db,
  // GetDBDisconnection,
  GetSyncDBConnection,
  GetSyncDBDisconnection
} = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');
const { fetchChildRolesQuery, getfetchRolesQuery, getSuperAdminRole, fetchParentRolesQuery, getUserInfoQuery } = require('../../config/dbqueries/index');
const moment = require('moment-timezone');
/**
 * To user role
 */
exports.getRoles = async () => {
  // sample promise to return
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .select('*')
      .from('roles')
      .whereNot('type', 'superadmin')
      .then((success) => {
        logger.info('Get Roles Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed GetRoles Service: ', error);
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

exports.createRoles = (name, type, module) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    console.log("module.......: ",module)
    dbconnection
      .insert({ name, type })
      .into('roles')
      .then((role) => {
        const roleId = role[0];
        if (module !== undefined) {
          dbconnection
            .insert({ admin_role_id: module, user_role_id: roleId })
            .into('sub_roles')
            .then((success) => {
              const response = {
                resultcode: successCode,
                body: {
                  message: 'Role has been successfully created'
                }
              };
              resolve(response);
            });
        } else {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Role has been successfully created'
            }
          };
          resolve(response);
        }
      })
      .catch((error) => {
        logger.error('Failed CreateRoles Service: ', error);
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

exports.editRoles = (id, name, type, module) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('roles')
      .update({ name: name, type: type })
      .where({ id: id })
      .then((role) => {
        // const roleId = role[0];
        if (module !== undefined) {
          dbconnection('sub_roles')
            .update({ admin_role_id: module })
            .where({ user_role_id: id })
            .then((success) => {
              const response = {
                resultcode: successCode,
                body: {
                  message: 'Role has been successfully edited'
                }
              };
              resolve(response);
            });
        } else {
          const response = {
            resultcode: successCode,
            body: {
              message: 'Role has been successfully edited'
            }
          };
          resolve(response);
        }
      })
      .catch((error) => {
        logger.error('Failed EditRoles Service: ', error);
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

exports.updateRoleStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    // status = 0 inactive, 1 active
    const dbconnection = GetSyncDBConnection();
    dbconnection('roles')
      .update({ status: status === 'true' ? 1 : 0 })
      .where('id', id)
      .then((success) => {
        logger.info('Update ROle Status Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: `Role has been successfully ${
              status === 'true' ? 'activated' : 'deactivated'
            }`
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed UpdateRoleStatus Service: ', error);
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

exports.getAdminRoles = (type) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();

    dbconnection
      .select('*')
      .from('roles')
      .whereIn('type', type)
      .then((success) => {
        logger.info('Get Admin Roles Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };

        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed GetAdminRoles Service: ', error);
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

exports.getSubRoles = (roleId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .select('roles.id', 'roles.name', 'roles.status')
      .from('roles')
      .leftJoin('sub_roles', 'sub_roles.user_role_id', 'roles.id')
      .where('sub_roles.admin_role_id', roleId)
      .then((success) => {
        logger.info('Get Admin Roles Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed GetSubRoles Service: ', error);
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

exports.fetchSubRoles = async (params) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    dbconnection.transaction((trx) => {
      transaction = trx;
      return dbconnection.raw(fetchChildRolesQuery, { parent_role_id: params.id }).transacting(transaction);
    })
      .then((childRoles) => {
        logger.info('childRoles fetched', childRoles);
        transaction.commit();
        resolve(childRoles[0]);
      })
      .catch((error) => {
        logger.info('error in fetch child roles', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.fetchRoles = async (params, queryObj, currentUser) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    const fetchRolesQuery = getfetchRolesQuery({
      business_unit: params.business_unit,
      user_type: queryObj.user_type
    }, queryObj, currentUser);
    const getCurrentUserQuery = getUserInfoQuery({
      username: currentUser
    });
    dbconnection.transaction((trx) => {
      transaction = trx;
      let userInfo = {};
      return new Promise((resolve, reject) => {
        dbconnection.raw(getCurrentUserQuery).transacting(transaction)
          .then((userInfoObj) => {
            logger.info('User Info Object Result', userInfoObj);
            if (userInfoObj && userInfoObj[0].length) {
              userInfo = userInfoObj[0][0];
              if (!queryObj.user_type) {
                return [];
              }
              return fetchParentRoles({ roleId: userInfo.roleId }, { user_type: queryObj.user_type });
            } else {
              return [];
            }
          })
          .then((parentRoles) => {
            if (parentRoles && parentRoles.length) {
              return [parentRoles];
            } else {
              return dbconnection.raw(fetchRolesQuery).transacting(transaction);
            };
          })
          .then((roles) => {
            logger.info('roles fetched from service', roles);
            if (roles && roles[0].length) {
              return roles;
            } else {
              const getSuperAdminQuery = getSuperAdminRole();
              return dbconnection.raw(getSuperAdminQuery).transacting(transaction);
            };
          })
          .then((roles) => {
            logger.info('roles fetched from service...!!!', roles);
            resolve(roles);
          })
          .catch((error) => {
            logger.info('error in fetch roles', error);
            reject(error);
          });
      });
      // return dbconnection.raw(fetchRolesQuery).transacting(transaction);
    })
      .then((roles) => {
        transaction.commit();
        resolve(roles[0]);
      })
      .catch((error) => {
        logger.info('error in fetch roles service', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

const fetchParentRoles = async (params, queryObj) => {
  const dbconnection = GetSyncDBConnection();
  return new Promise((resolve, reject) => {
    let transaction;
    const getParentRolesQuery = fetchParentRolesQuery({
      roleId: params.roleId ? params.roleId : (queryObj.roleId ? queryObj.roleId : -1),
      userType: queryObj.user_type
    });
    logger.info('Query for fetching parents ' + getParentRolesQuery, getParentRolesQuery);
    dbconnection.transaction((trx) => {
      transaction = trx;
      return new Promise((resolve, reject) => {
        dbconnection.raw(getParentRolesQuery).transacting(transaction)
          .then((parentRoles) => {
            logger.info('Parent roles fetched from service...!!!', parentRoles);
            resolve(parentRoles[0]);
          })
          .catch((error) => {
            logger.info('error in fetch parent roles', error);
            reject(error);
          });
      });
      // return dbconnection.raw(fetchRolesQuery).transacting(transaction);
    })
      .then((parentRoles) => {
        transaction.commit();
        resolve(parentRoles);
      })
      .catch((error) => {
        logger.info('error in fetch parent roles service', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.fetchParentRoles = fetchParentRoles;

exports.createRole = async (roleObj, currentUser) => {
  const dbconnection = GetSyncDBConnection();
  const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    let transaction;
    let roleId;
    roleObj.createdBy = currentUser;
    roleObj.createdOn = now;
    roleObj.updatedBy = currentUser;
    roleObj.updatedOn = now;
    let groups = roleObj.groups;
    delete roleObj.groups;
    const subRoles = [];
    dbconnection.transaction((trx) => {
      transaction = trx;
      return new Promise((resolve, reject) => {
        dbconnection.insert(roleObj).into('roles').transacting(transaction)
          .then((roles) => {
            logger.info('role created successfully..!', roles);
            if (groups && groups.length) {
              roleId = roles[0];
              groups = groups.map((roleGroup) => {
                return { groupId: roleGroup, roleId };
              });
              return dbconnection.insert(groups).into('roles_groups').transacting(transaction);
            } else {
              return [];
            }
          })
          .then((roleGroups) => {
            logger.info('role groups created successfully..!!!', roleGroups);
            return fetchParentRoles({}, { roleId: roleObj.parent_role_id });
          })
          .then((parentRoles) => {
            logger.info('parent roles fetched successfully..!!!', parentRoles);
            if (parentRoles && parentRoles.length) {
              parentRoles.forEach((parent) => {
                subRoles.push({ admin_role_id: parent.id, user_role_id: roleId });
              });
              return dbconnection.insert(subRoles).into('sub_roles').transacting(transaction);
            }
            return [];
          })
          .then((subRoles) => {
            logger.info('Sub roles created successfully..!!!', subRoles);
            resolve(roleId);
          })
          .catch((error) => {
            logger.info('error in create role service', error);
            reject(error);
          });
      });
    })
      .then((roleId) => {
        logger.info('role created successfully..!', roleId);
        transaction.commit();
        const response = {
          resultcode: successCode,
          body: {
            message: 'Role has been successfully created'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.info('error in create role service', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};

exports.updateRoles = (req, currentUser) => {
  const paramObj = req.param;
  // const queryObj = req.query;
  const body = req.body.data;
  const dbconnection = GetSyncDBConnection();
  const now = moment().tz('Asia/Singapore').format('YYYY-MM-DD HH:mm:ss');
  return new Promise((resolve, reject) => {
    let transaction;
    const roleId = paramObj.roleId ? paramObj.roleId : body.id;
    delete body.id;
    dbconnection.transaction((trx) => {
      transaction = trx;
      let groups = body.groups;
      let subRoles = body.subRoles;
      delete body.groups;
      delete body.subRoles;
      body.updatedBy = currentUser;
      body.updatedOn = now;
      return new Promise((resolve, reject) => {
        dbconnection('roles').where({ id: roleId }).update(body).transacting(transaction)
          .then(async (roleObj) => {
            logger.info('role updated successfully', roleObj);
            if (subRoles && subRoles.length) {
              logger.info('subRoles to be taken care..!', subRoles);
              subRoles = subRoles.map((subRole) => {
                return { user_role_id: subRole, admin_role_id: roleId };
              });
              await dbconnection('sub_roles').del().where({ roleId }).transacting(transaction);
              return dbconnection('sub_roles').insert(subRoles).transacting(transaction);
            } else {
              return [];
            }
          })
          .then(async (subRolesRes) => {
            logger.info('sub role updated successfully..!', subRolesRes);
            if (groups && groups.length) {
              groups = groups.map((roleGroup) => {
                return { groupId: roleGroup, roleId };
              });
              await dbconnection('roles_groups').del().where({ roleId }).transacting(transaction);
              return dbconnection('roles_groups').insert(groups).transacting(transaction);
            } else {
              return [];
            }
          })
          .then(async (roleGroupsResult) => {
            logger.info('Groups updated for the user..!', roleGroupsResult);
            resolve(roleId);
          })
          .catch((error) => {
            logger.info('role update service error:', error);
            reject(error);
          });
      });
    })
      .then((roleId) => {
        logger.info('role updated successfully..!', roleId);
        transaction.commit();
        const response = {
          resultcode: successCode,
          body: {
            message: 'Role has been successfully updated.'
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.info('error in update role service', error);
        transaction.rollback();
        reject(error);
      })
      .finally(() => {
        GetSyncDBDisconnection(dbconnection);
      });
  });
};
