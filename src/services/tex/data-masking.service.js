/* eslint-disable no-useless-catch */
const { logger } = require('../../utils/logger');
const { isEmpty } = require('../../utils/common');
const {
  GetSyncDBConnection,
  GetSyncDBDisconnection
} = require('../../services/db');
exports.getPolicyListByGroup = async (username) => {
  // Get UserID from users table using username
  // Get userGroupId  from user_groups table using userId
  // Get group names from policies table using userGroupId.
  const dbconnection = GetSyncDBConnection();
  try {
    logger.info('Get user Groups service', username);
    const user = await dbconnection('users').select('id').where('username', username);
    logger.info('user', user);
    if (!isEmpty(user)) {
      const group = await dbconnection('user_groups').select('userGroupId').where('userId', user[0].id);
      logger.info('group', group);
      // Get the coming data({"0":{"policyId":29},"1":{"policyId":40},"2":{"policyId":30}}) in array format
      const groups = await getPolicyIds(group, 'userGroupId');
      logger.info('groups', groups);
      const policies = await dbconnection('groups_policies')
        .select('policyId')
        .whereIn('groupId', groups);
      logger.info('policies', policies);
      const policyids = await getPolicyIds(policies, 'policyId');
      logger.info('policyids', policyids);
      const policyList = await dbconnection('policies')
        .select('id', 'name')
        .whereIn('id', policyids);
      logger.info('policyList', policyList);
      return policyList;
    } else {
      return true;
    }
  } catch (error) {
    logger.error('error', error);
    throw error;
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};
exports.getUserPolicies = async (username) => {
  // Get UserID from users table using username
  // Get PolicyId  from user_policies table using userId
  // Get policy names from policies table using policyId.
  const dbconnection = GetSyncDBConnection();
  try {
    logger.info('Get user Policies service', username);
    const user = await dbconnection('users').select('id').where('username', username);
    logger.info('user', user);
    if (!isEmpty(user)) {
      const policy = await dbconnection('user_policies').select('policyId').where('userId', user[0].id);
      logger.info('policy', policy);
      // Get the coming data({"0":{"policyId":29},"1":{"policyId":40},"2":{"policyId":30}}) in array format
      const policies = await getPolicyIds(policy, 'policyId');
      logger.info('policies', policies);
      const policyNames = await dbconnection('policies')
        .select('id', 'name')
        .whereIn('id', policies);
      logger.info('policyNames', policyNames);
      return policyNames;
    } else {
      return true;
    }
  } catch (error) {
    logger.error('error', error);
    throw error;
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};
const getPolicyIds = async (array, searchKeyname) => {
  const formedArray = [];
  Object.keys(array).forEach((key) => {
    formedArray.push(array[key][searchKeyname]);
  });
  return formedArray;
};
exports.checkUserHaveDataMaskingPolicy = async (policies) => {
  logger.info('in checkUserHaveDataMaskingPolicy', policies);
  return policies.some(
    (item) => item.name === 'DataMasking' || item.name === 'PartialDataMasking'
  );
};
exports.getUserComponents = async (policies) => {
  const dbconnection = GetSyncDBConnection();
  try {
    // get the particular policyId for data masking
    const policyId = policies.filter(
      (ele) => ele.name === 'DataMasking' || ele.name === 'PartialDataMasking'
    );
    // Get component Ids from 'policies_components' table using policyId
    const componentIds = await dbconnection('policies_components')
      .select('componentId')
      .whereIn('policyId', [policyId[0].id]);
    logger.info('componentIds in getUserComponents', componentIds);
    // Get the coming data({"0":{"policyId":29},"1":{"policyId":40},"2":{"policyId":30}}) in array format
    const ids = await getPolicyIds(componentIds, 'componentId');
    logger.info('component IDs', ids);
    // Finally get the component names from the 'components' table
    const componentNames = await dbconnection('components')
      .select('name')
      .whereIn('id', ids)
      .andWhere('status', 1);
    logger.info('componentNames in getUserComponents', componentNames);
    return componentNames;
  } catch (error) {
    logger.error('error', error);
    throw error;
  } finally {
    GetSyncDBDisconnection(dbconnection);
  }
};
exports.isComponentPresent = (array, componentName) => {
  logger.info('componentNames in account service', array, componentName);
  return array.some(item => item.name === componentName);
};
