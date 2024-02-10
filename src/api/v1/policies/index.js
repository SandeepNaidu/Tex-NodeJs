const express = require('express');
// const { validate } = require('express-validation');
const router = express.Router();

// const validation = require('./policies.validation');
const controller = require('./policies.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');

// Route for fetching list of policy
router.route('/').get(adminModuleAuth, controller.getPolicies);

// Route for creating a policy
router.route('/').post(adminModuleAuth, controller.createPolicy);

// Route for editing a policy
router.route('/:id').put(adminModuleAuth, controller.editPolicy);

// Route for updating the status
router.route('/:id').delete(adminModuleAuth, controller.updatePolicyStatus);

module.exports = router;
