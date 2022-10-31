const router = require('express').Router();

const otpREST = require('../rest/otpRES');

router.post('/', otpREST.createOTP);
router.get('/verify', otpREST.verifyOtp);
module.exports = router;
