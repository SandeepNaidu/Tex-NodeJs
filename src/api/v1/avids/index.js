const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const controller = require('./avids.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');

// Route for fetching list of components
// router.route('/').get(adminModuleAuth, controller.getComponents);

// Route for creating a component
router.route('/').post(adminModuleAuth, controller.createAvid);
router.route('/post').post(adminModuleAuth, controller.createPostThroughAvid);
router.route('/:ids/artistId/:artistId').get(adminModuleAuth, controller.getAvidsById);
router.route('/artist/:id').get(adminModuleAuth, controller.getAvidsByArtistId);
router.route('/mode/:mode').get(adminModuleAuth, controller.getAllAvids);
router.route('/:id').put(adminModuleAuth, controller.editAvidById);
router.route('/share').post(adminModuleAuth, controller.avidShare);
router.route('/like').post(adminModuleAuth, controller.avidLike);
router.route('/save').post(adminModuleAuth, controller.avidSave);

module.exports = router;
