const express = require('express');
const {
    validate
} = require('express-validation');
const router = express.Router();

const controller = require('./posts2.controller');
const {
    adminModuleAuth
} = require('../../../middlewares/basic-auth');

router.route('/').post(adminModuleAuth, controller.createPostV2);
router.route('/getAllWithCount/:userId').get(adminModuleAuth, controller.getAllPostsV2);
router.route('/getAll').get(adminModuleAuth, controller.getAllDefault);
router.route('/getPostById/:id').get(adminModuleAuth, controller.getPostById);
router.route('/like').post(adminModuleAuth, controller.likeAPost);
router.route('/unlike').post(adminModuleAuth, controller.unlikeAPost);
router.route('/share').post(adminModuleAuth, controller.shareAPost);
router.route('/unshare').post(adminModuleAuth, controller.unshareAPost);
router.route('/save').post(adminModuleAuth, controller.saveAPost);
router.route('/unsave').post(adminModuleAuth, controller.unsaveAPost);
router.route('/getAllByArtistId/:artistId').get(adminModuleAuth, controller.getAllByArtistId);
router.route('/report').post(adminModuleAuth, controller.reportAPost);
router.route('/unreport').post(adminModuleAuth, controller.unreportAPost);
router.route('/all-options').get(adminModuleAuth, controller.getAllOptions);
router.route('/vote').post(adminModuleAuth, controller.voteOption);
router.route('/all-votings').get(adminModuleAuth, controller.getAllVotingResults);
router.route('/reaction/artist/:id').get(adminModuleAuth, controller.postReaction);

module.exports = router;
