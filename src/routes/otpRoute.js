const router = require('express').Router();

const otpREST = require('../rest/otpRES');

router.post('/', otpREST.createOTP);

module.exports = router;
