const router = require('express').Router();

const authREST = require('../rest/authREST');
const middleAuth = require('../rest/middleAuth');

router.post('/login', authREST.login);
router.post('/register', authREST.register);
router.post('/refresh', authREST.requestRefreshToken);
router.post('/logout', middleAuth.verifyToken, authREST.logOut);

module.exports = router;
