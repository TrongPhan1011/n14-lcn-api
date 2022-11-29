const router = require('express').Router();

const otpREST = require('../rest/otpRES');

router.post('/', otpREST.createOTP);
router.get('/verify', otpREST.verifyOtp);
router.post('/ban', otpREST.banAccount);
router.get('/ban/:email', otpREST.findBanAccount);
module.exports = router;
