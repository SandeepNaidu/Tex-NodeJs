const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const validation = require('./components.validation');
const controller = require('./components.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');

// Route for fetching list of components
router.route('/').get(adminModuleAuth, controller.getComponents);

// Route for creating a component
router.route('/').post([adminModuleAuth, validate(validation.component)], controller.createComponent);

// Route for fetching component based on id
router.route('/:id/edit').get(adminModuleAuth, controller.getComponentsById);

// Route for editing a component
router.route('/:id').put([adminModuleAuth, validate(validation.component)], controller.editComponent);

// Route for updating the status
router.route('/:id').delete(adminModuleAuth, controller.updateComponentStatus);

module.exports = router;
