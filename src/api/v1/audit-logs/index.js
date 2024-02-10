const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const validation = require('./audit-logs.validation');
const controller = require('./audit-logs.controller');

router.route('/').post(validate(validation.auditLog), controller.auditLog);

module.exports = router;
