const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

exports.getGroups = () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .column({ label: 'name' }, { value: 'id' })
      .select()
      .from('groups')
      .where({ status: 1 })
      .then((success) => {
        logger.info('Get Groups Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Get Groups Service: ', error);
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

exports.createGroup = (body) => {
  const { name, policies } = body;
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({ name })
      .into('groups')
      .then((group) => {
        const groupId = group[0];
        const policyMapping = [];
        policies.forEach((policy) => {
          policyMapping.push({ groupId, policyId: policy });
        });
        dbconnection
          .insert(policyMapping)
          .into('groups_policies')
          .then((res) => {
            logger.info('Create Group Service Response:', res);
            const response = {
              resultcode: successCode,
              body: {
                message: 'Group has been successfully created'
              }
            };
            resolve(response);
          })
          .catch((error) => {
            logger.error('Failed Create Group Service: ', error);
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
};

exports.updateGroupStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    // status = 0 inactive, 1 active
    const dbconnection = GetSyncDBConnection();
    dbconnection('groups')
      .update({ status: status === 'true' ? 1 : 0 })
      .where('id', id)
      .then((success) => {
        logger.info('Update Group Status Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: `Group has been successfully ${
              status === 'true' ? 'activated' : 'deactivated'
            }`
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Create Group Service: ', error);
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

exports.editGroup = (body) => {
  const { name, policies, id } = body;
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('groups')
      .update({ name: name })
      .where({ id: id })
      .then((group) => {
        dbconnection('groups_policies')
          .del()
          .where({ groupId: id })
          .then((result) => {
            const groupId = id;
            const policyMapping = [];
            policies.forEach((policy) => {
              policyMapping.push({ groupId, policyId: policy });
            });
            dbconnection('groups_policies')
              .insert(policyMapping)
              .then((res) => {
                logger.info('Edit Group Service Response:', res);
                const response = {
                  resultcode: successCode,
                  body: {
                    message: 'Group has been successfully edited'
                  }
                };
                resolve(response);
              })
              .catch((error) => {
                logger.error('Failed Edit Group Service: ', error);
                const response = {
                  resultcode: errorCode,
                  body: {
                    data: error
                  }
                };
                reject(response);
              });
          })
          .finally(() => {
            GetSyncDBDisconnection(dbconnection);
          });
      });
  });
};

exports.getGroupsFromRole = (roleId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      // .select('groups.id', 'groups.name')
      .column({ label: 'groups.name' }, { value: 'groups.id' })
      .from('groups')
      .innerJoin('roles_groups', 'roles_groups.groupId', 'groups.id')
      .where('roles_groups.roleId', roleId)
      .then((success) => {
        logger.info('Get Group from Role Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Get Group from Role Service: ', error);
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

exports.getAdminGroups = (userId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .column({ label: 'groups.name' }, { value: 'groups.id' })
      .from('groups')
      .innerJoin('user_groups', 'user_groups.userGroupId', 'groups.id')
      .where({ 'user_groups.userId': userId, status: 1 })
      .then((success) => {
        logger.info('Get Admin Groups Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Get Admin Groups Service: ', error);
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

exports.getGroupsAndPolicies = async () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .select(
        'groups.id',
        'groups.name as groupName',
        'groups.status',
        'policies.name as policyName',
        'policies.id as policyId'
      )
      .from('groups')
      .leftJoin('groups_policies', 'groups_policies.groupId', 'groups.id')
      .leftJoin('policies', 'policies.id', 'groups_policies.policyId')
      .then((data) => {
        logger.info('Get Groups and Policies Service Response:', data);
        const dataSet = [];
        const uniqueIds = [...new Set(data.map((item) => item.id))];
        uniqueIds.forEach((id) => {
          const uniqueData = data.filter((el) => el.id === id);
          const policiesList = uniqueData.map((p) => p.policyName).join(', ');
          const policyId = uniqueData.map((p) => p.policyId).join(', ');
          dataSet.push({
            id: uniqueData[0].id,
            name: uniqueData[0].groupName,
            status: uniqueData[0].status,
            policies: policiesList,
            policyId: policyId
          });
        });
        const response = {
          resultcode: successCode,
          body: {
            data: dataSet
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Get Groups and Policies Service: ', error);
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
