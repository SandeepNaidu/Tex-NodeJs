const express = require('express');
// const { validate } = require('express-validation');
const router = express.Router();

// const validation = require('./components.validation');
const controller = require('./groups.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');

// Route for fetching list of components
router.route('/').get(adminModuleAuth, controller.getGroups);

// Route for creating a component
router.route('/').post(adminModuleAuth, controller.createGroup);

// Route to get list of policies based on group ID
router.route('/:groupId/policies').get(adminModuleAuth, controller.getPoliciesFromGroup);

// Route for editing  a group
router.route('/:id').put(adminModuleAuth, controller.editGroup);

// Route for updating the status
router.route('/:id').delete(adminModuleAuth, controller.updateGroupStatus);

module.exports = router;
