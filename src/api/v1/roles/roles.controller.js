const httpStatus = require('http-status');
// const { successCode } = require('../../../config/vars');
const { Response, ErrorResponse } = require('../../../utils/response');
const { logger } = require('../../../utils/logger');
const tex = require('../../../services/tex');
const { errorMessage } = require('../../../utils/common');

// To get all roles from DB
exports.getRoles = async (req, res) => {
  try {
    let roles;
    const roleType = res.locals.roleType;
    let type;
    switch (roleType) {
      case 'dcaadmin':
        type = ['dcaagency'];
        roles = await tex.getAdminRoles(type);
        break;
      case 'dcaagency':
        type = ['dcauser'];
        roles = await tex.getAdminRoles(type);
        break;
      default:
        roles = await tex.getRoles();
    }
    logger.info('Get Roles Info Controller Request:', req.query.type);
    logger.info('Get Roles Info  DCA Controller Request:', req.query.type);
    /* if (req.query.type) {
      roles = await tex.getAdminRoles();
    } else {
      roles = await tex.getRoles();
    } */
    const jsonResponse = Response(httpStatus.OK, { roles: roles.body.data });
    logger.info('Get Roles Info Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getRoles: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// To create role in tex DB
exports.createRoles = async (req, res) => {
  try {
    const { name, type, module } = req.body.data;
    logger.info('Get Roles Info Controller Request:', name, type, module);
    const roles = await tex.createRoles(name, type, module);
    const jsonResponse = Response(httpStatus.OK, { roles });
    logger.info('Create Roles Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createRoles: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// Get all groups based on role ID
exports.getGroupsFromRole = async (req, res, next) => {
  try {
    logger.info(
      'Get Groups from Role Info Controller Request:',
      req.params.roleId
    );
    const groups = await tex.getGroupsFromRole(req.params.roleId);
    const jsonResponse = Response(httpStatus.OK, { groups: groups.body.data });
    logger.info('Get Groups from Role Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getGroupsFromRole: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.getSubRoles = async (req, res) => {
  try {
    logger.info('Get Sub Role Info Controller Request:', req.params.roleId);
    const roles = await tex.getSubRoles(req.params.roleId);
    const jsonResponse = Response(httpStatus.OK, { roles: roles.body.data });
    logger.info('Get Sub Roles Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed getRoles: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// To edit role in tex DB
exports.editRoles = async (req, res) => {
  try {
    logger.info('Edit Roles Info Controller Request:', req.body);
    // const { id, name, type, module } = req.body.data;
    // const roles = await tex.editRoles(id, name, type, module);
    const roles = await tex.updateRoles(req, res.locals.username);
    const jsonResponse = Response(httpStatus.OK, { roles });
    logger.info('Edit Roles Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed update roles service: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

// change status of a role
exports.updateRoleStatus = async (req, res) => {
  try {
    logger.info(
      'Update Role Status Info Controller Request:',
      req.params.id,
      req.query.status
    );
    const role = await tex.updateRoleStatus(req.params.id, req.query.status);
    const jsonResponse = Response(httpStatus.OK, { role });
    logger.info('Update Role Status Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed updateRoleStatus: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.fetchSubRoles = async (req, res) => {
  try {
    logger.info(
      'Child roles requested for Id',
      {
        params: req.params,
        query: req.query
      }
    );
    const childRoles = await tex.fetchSubRoles(req.params);
    const jsonResponse = Response(httpStatus.OK, { roles: childRoles });
    logger.info('Fetch Roles for parent Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed fetch Roles: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.fetchRoles = async (req, res) => {
  try {
    logger.info(
      'Roles requested for Business Unit',
      {
        params: req.params,
        query: req.query
      }
    );
    const childRoles = await tex.fetchRoles(req.params, req.query, res.locals.username);
    const jsonResponse = Response(httpStatus.OK, { roles: childRoles });
    logger.info('Fetch Roles for Business Unit Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed fetch Roles: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.fetchParentRoles = async (req, res) => {
  try {
    logger.info(
      'Roles requested for Business Unit',
      {
        params: req.params,
        query: req.query
      }
    );
    const parentRoles = await tex.fetchParentRoles(req.params, req.query);
    const jsonResponse = Response(httpStatus.OK, { parentRoles });
    logger.info('Fetch Parent Roles Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed fetch parent roles: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};

exports.createRole = async (req, res) => {
  try {
    const { name, type, module } = req.body.data;
    logger.info('Get Roles Info Controller Request:', name, type, module);
    const roles = await tex.createRole(req.body.data, res.locals.username);
    const jsonResponse = Response(httpStatus.OK, { roles });
    logger.info('Create Roles Info Controller Response:', jsonResponse);
    return res.status(httpStatus.OK).json(jsonResponse);
  } catch (exception) {
    logger.error('Failed createRoles: ', exception);
    const jsonResponse = ErrorResponse(
      httpStatus.INTERNAL_SERVER_ERROR,
      errorMessage(exception)
    );
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    return res.json(jsonResponse);
  }
};
