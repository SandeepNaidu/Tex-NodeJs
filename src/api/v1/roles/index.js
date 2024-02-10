const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const validation = require('./roles.validation');
const controller = require('./roles.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');

// Route for fetching list of roles
router.route('/').get(adminModuleAuth, controller.getRoles);

router.route('/:business_unit').get(adminModuleAuth, controller.fetchRoles);

router.route('/').post(adminModuleAuth, controller.createRole);

router.route('/:id').put(adminModuleAuth, controller.editRoles);

// Route for creating a role
router.route('/createRole').post([adminModuleAuth, validate(validation.role)], controller.createRoles);

// Route for getting list of groups based on role ID
router.route('/:roleId/groups').get(adminModuleAuth, controller.getGroupsFromRole);

// Route for getting list of sub roles based on parent role ID
router.route('/:id/childRoles').get(adminModuleAuth, controller.fetchSubRoles);

router.route('/:roleId/parentRoles').get(adminModuleAuth, controller.fetchParentRoles);

// Route for editing a role
router.route('/edit').post(adminModuleAuth, controller.editRoles);

// Route for updating the status
router.route('/:id').delete(adminModuleAuth, controller.updateRoleStatus);

router.route('/:roleId/subRoles').get(adminModuleAuth, controller.getSubRoles);
module.exports = router;
