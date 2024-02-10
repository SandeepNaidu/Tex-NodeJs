const express = require('express');

const router = express.Router();
const v1 = require('./v1');
// const { dcaLoginCheck } = require('../middlewares/dca-login-check');
/**
 * GET v1
 */
// router.use(dcaLoginCheck);
router.use('/v1', v1);

module.exports = router;
