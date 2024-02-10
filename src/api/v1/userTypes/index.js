const express = require('express');
// const { validate } = require('express-validation');
const router = express.Router();

const controller = require('./userTypes.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');

router.route('/').get(adminModuleAuth, controller.fetchUserTypes);

module.exports = router;
