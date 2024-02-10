const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

// Get list of all groups
exports.getGroups = async (req, res) => {
  try {
    logger.info('Get Groups Controller Request:', req.query);
    //= =====group changes for dca ==============//
    let groups;

    if (req.query.user) {
      groups = await tex.getAdminGroups(parseInt(req.query.user));
    } else if (req.query.policies) {
      groups = await tex.getGroupsAndPolicies();
    } else {
      groups = await tex.getGroups();
    }
    const jsonResponse = Response(httpStatus.OK, { groups: groups.body.data });
    logger.info('Get Groups Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getGroups: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Create a group
exports.createGroup = async (req, res) => {
  try {
    logger.info('Create Group Controller Request:', req.body);
    const group = await tex.createGroup(req.body.data);
    const jsonResponse = Response(httpStatus.OK, { group });
    logger.info('Create Group Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createGroup: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getPoliciesFromGroup = async (req, res, next) => {
  try {
    logger.info('Get Policies from Group Request:', req.params.groupId);
    const policies = await tex.getPoliciesFromGroup(req.params.groupId);
    const jsonResponse = Response(httpStatus.OK, {
      policies: policies.body.data
    });
    logger.info('Get Policies from Group Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getPoliciesFromGroup: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// change status of a role
exports.updateGroupStatus = async (req, res) => {
  try {
    logger.info(
      'Update Group status Request:',
      req.params.is,
      req.query.status
    );
    const group = await tex.updateGroupStatus(req.params.id, req.query.status);
    const jsonResponse = Response(httpStatus.OK, { group });
    logger.info('Update Group Status Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed updateGroupStatus: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Edit a group

exports.editGroup = async (req, res) => {
  try {
    logger.info('Edit Group Controller Request:', req.body);
    const group = await tex.editGroup(req.body.data);
    const jsonResponse = Response(httpStatus.OK, { group });
    logger.info('Edit Group Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editGroup: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
