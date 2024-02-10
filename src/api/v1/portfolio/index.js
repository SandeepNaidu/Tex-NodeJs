const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const controller = require('./portfolio.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');


router.route('/').post(adminModuleAuth, controller.createPortfolio);
router.route('/user/:id').get(adminModuleAuth, controller.getPortfoliosByUserId);
router.route('/user/images/:id').get(adminModuleAuth, controller.getPortfoliosByUserImagesId);
router.route('/:id').delete(adminModuleAuth, controller.deletePortfoliosById);
router.route('/:id').put(adminModuleAuth, controller.editPortfoliosById);

// Route for creating a component
router.route('/experience').post(adminModuleAuth, controller.createExperiences);
router.route('/experience/user/:id').get(adminModuleAuth, controller.getExperiencesByUserId);
router.route('/experience/:id').delete(adminModuleAuth, controller.deleteExperiencesById);
router.route('/experience/:id').put(adminModuleAuth, controller.editExperiencesById);

module.exports = router;
