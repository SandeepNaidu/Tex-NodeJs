const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const controller = require('./tags.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');

// Route for fetching list of components
// router.route('/').get(adminModuleAuth, controller.getComponents);

// Route for creating a component
router.route('/').post(adminModuleAuth, controller.createTag);
router.route('/:ids').get(adminModuleAuth, controller.getTagsById);
router.route('/name/:name').get(adminModuleAuth, controller.getTagsByName);
router.route('/').get(adminModuleAuth, controller.getAllTags);
router.route('/:ids').delete(adminModuleAuth, controller.deleteTagsById);
router.route('/:ids').put(adminModuleAuth, controller.editTagsById);
module.exports = router;
