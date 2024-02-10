const express = require('express');
const router = express.Router();

const controller = require('./cloud-report.controller');
const { adminModuleAuth } = require('../../../middlewares/basic-auth');
const validation = require('./cloud-report-api-validation');
const { validate } = require('express-validation');

// get json response for json file and csv file
router.route('/').post(validate(validation.cloudReportInfo), adminModuleAuth, controller.getCloudReport);

module.exports = router;
