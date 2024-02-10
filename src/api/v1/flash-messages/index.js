const express = require('express');
const { validate } = require('express-validation');
const router = express.Router();

const validation = require('./flash-messages.validation');
const controller = require('./flash-messages.controller');

router
  .route('/')
  .post(validate(validation.flashMessageInfo), controller.flashMessagesInfo);

module.exports = router;
