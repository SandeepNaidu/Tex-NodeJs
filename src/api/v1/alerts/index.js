const express = require('express');
// const { validate } = require('express-validation');
const router = express.Router();

// const validation = require('./campaigns.validation');
const controller = require('./alerts.controller');
// const { adminModuleAuth } = require('../../../middlewares/basic-auth');

// Route for fetching list of policy
router.route('/').get(controller.getAlerts);

// Route for creating a policy
router.route('/').post(controller.createAlert);

// Route for editing a policy
router.route('/:id').put(controller.editAlert);

// Route for updating the status
router.route('/:id').delete(controller.deleteAlert);

module.exports = router;
