const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

// Get list of all policies
exports.getPolicies = async (req, res, next) => {
  try {
    let policies;
    logger.info('Get Policies Info Controller Request:', req.query.groups);
    if (req.query.groups) {
      const groups = req.query.groups.split(',').map(Number);
      policies = await tex.getGroupPolicies(groups);
    } else if (req.query.components) {
      policies = await tex.getPoliciesAndComponents();
    } else {
      policies = await tex.getPolicies();
    }
    const jsonResponse = Response(httpStatus.OK, {
      policies: policies.body.data
    });
    logger.info('Create Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getPolicies: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Create a new policy
exports.createPolicy = async (req, res, next) => {
  try {
    logger.info('Create Policy Info Controller Request:', req.body);
    const policy = await tex.createPolicy(req.body.data);
    const jsonResponse = Response(httpStatus.OK, { policy });
    logger.info('Create Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createPolicy: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.editPolicy = async (req, res) => {
  try {
    logger.info('Edit Policy Info Controller Request:', req.body);
    const policy = await tex.editPolicy(req.body.data);
    const jsonResponse = Response(httpStatus.OK, { policy });
    logger.info('Edit Policy Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed editPolicy: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// change status of a policy
exports.updatePolicyStatus = async (req, res) => {
  try {
    logger.info(
      'Update Policy Status Info Controller Request:',
      req.params.id,
      req.query.status
    );
    const policy = await tex.updatePolicyStatus(
      req.params.id,
      req.query.status
    );
    const jsonResponse = Response(httpStatus.OK, { policy });
    logger.info('Update Ploicy Status Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed updatePolicyStatus: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
