const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();
const { humanCheck } = require('../../../middlewares/basic-auth');

const validation = require('./auth.validation');
const controller = require('./auth.controller');

// Route for user login
router.route('/login').post([humanCheck, validate(validation.auth)], controller.login);

// Route for change password on first time login
router.route('/changePassword').post(humanCheck, controller.changePassword);

// Route for forgot password
router.route('/forgotPassword').post(controller.forgotPassword);

// Route for confirming forgot password with code
router.route('/confirmForgotPassword').post(controller.confirmForgotPassword);

// Route for changing user password by superadmin
router.route('/adminResetPassword').post(controller.adminResetPassword);

// Route for signout
router.route('/signout').post(controller.signOut);

module.exports = router;
