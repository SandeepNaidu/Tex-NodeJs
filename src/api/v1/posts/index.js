const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const controller = require('./posts.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');


// Route for creating a component
router.route('/').post(adminModuleAuth, controller.createPost);
router.route('/share').post(adminModuleAuth, controller.postShare);
router.route('/like').post(adminModuleAuth, controller.postLike);
router.route('/save').post(adminModuleAuth, controller.postSave);
router.route('/report').post(adminModuleAuth, controller.postReport);
router.route('/vote').post(adminModuleAuth, controller.postVote);
router.route('/artist/:id').get(adminModuleAuth, controller.getPostsByArtistId);
router.route('/').get(adminModuleAuth, controller.getAllPosts);

module.exports = router;
