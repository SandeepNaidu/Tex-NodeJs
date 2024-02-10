const { GetSyncDBConnection, GetSyncDBDisconnection } = require('../db');
const { successCode, errorCode } = require('../../config/vars');
const { logger } = require('../../utils/logger');

exports.getPolicies = () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .column({ label: 'name' }, { value: 'id' }, { status: 'status' })
      .select()
      .from('policies')
      .where({ status: 1 })
      .then((success) => {
        logger.info('Get Policies Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Get Policies Service: ', error);
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

exports.createPolicy = (body) => {
  const { name, components } = body;
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .insert({ name })
      .into('policies')
      .then((policy) => {
        const policyId = policy[0];
        const componentMapping = [];
        components.forEach((component) => {
          componentMapping.push({ policyId, componentId: component });
        });
        dbconnection
          .insert(componentMapping)
          .into('policies_components')
          .then((res) => {
            logger.info('Create Policy Service Response:', res);
            const response = {
              resultcode: successCode,
              body: {
                message: 'Policy has been successfully created'
              }
            };
            resolve(response);
          })
          .catch((error) => {
            logger.error('Failed Create Policy Service: ', error);
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

exports.editPolicy = (body) => {
  const { name, components, id } = body;
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection('policies')
      .update({ name })
      .where({ id })
      .then((policy) => {
        dbconnection('policies_components')
          .del()
          .where({ policyId: id })
          .then((result) => {
            const policyId = id;
            const componentMapping = [];
            components.forEach((component) => {
              componentMapping.push({ policyId, componentId: component });
            });
            dbconnection('policies_components')
              .insert(componentMapping)
              .then((res) => {
                logger.info('Edit Policy Service Response:', res);
                const response = {
                  resultcode: successCode,
                  body: {
                    message: 'Policy has been successfully edited'
                  }
                };
                resolve(response);
              })
              .catch((error) => {
                logger.error('Failed Edit Policy Service: ', error);
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

exports.updatePolicyStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    // status = 0 inactive, 1 active
    const dbconnection = GetSyncDBConnection();
    dbconnection('policies')
      .update({ status: status === 'true' ? 1 : 0 })
      .where('id', id)
      .then((success) => {
        logger.info('Update Policy Status Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            message: `Policy has been successfully ${
              status === 'true' ? 'activated' : 'deactivated'
            }`
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed UpdatePolicyStatus Service: ', error);
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

exports.getPoliciesFromGroup = (groupId) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .select('policies.id', 'policies.name')
      .from('policies')
      .innerJoin('groups_policies', 'groups_policies.policyId', 'policies.id')
      .where('groups_policies.groupId', groupId)
      .then((success) => {
        logger.info('Get Policy from Group Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Policies from Group Service: ', error);
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

exports.getGroupPolicies = (groups) => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .distinct('policies.id', 'policies.name')
      .from('policies')
      .innerJoin('groups_policies', 'groups_policies.policyId', 'policies.id')
      .whereIn('groups_policies.groupId', groups)
      .where('policies.status', 1)
      .then((success) => {
        logger.info('Get Group Policy Service Response:', success);
        const response = {
          resultcode: successCode,
          body: {
            data: success
          }
        };
        resolve(response);
      })
      .catch((error) => {
        logger.error('Failed Get Group Policies Service: ', error);
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

exports.getPoliciesAndComponents = async () => {
  return new Promise((resolve, reject) => {
    const dbconnection = GetSyncDBConnection();
    dbconnection
      .select(
        'policies.id',
        'policies.name as policyName',
        'policies.status',
        'components.name as componentName',
        'components.id as componentId'
      )
      .from('policies')
      .leftJoin(
        'policies_components',
        'policies_components.policyId',
        'policies.id'
      )
      .leftJoin(
        'components',
        'components.id',
        'policies_components.componentId'
      )
      .then((data) => {
        logger.info('Get Policies and Components Service Response:', data);
        const dataSet = [];
        const uniqueIds = [...new Set(data.map((item) => item.id))];
        uniqueIds.forEach((id) => {
          const uniqueData = data.filter((el) => el.id === id);
          const componentsList = uniqueData
            .map((c) => c.componentName)
            .join(', ');
          const componentId = uniqueData.map((c) => c.componentId).join(', ');
          dataSet.push({
            id: uniqueData[0].id,
            name: uniqueData[0].policyName,
            status: uniqueData[0].status,
            components: componentsList,
            componentId
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
        logger.error('Failed Get Policies and Components Service: ', error);
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
