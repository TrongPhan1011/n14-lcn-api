const router = require('express').Router();

const authREST = require('../rest/authREST');
const middleAuth = require('../rest/middleAuth');

router.post('/login', authREST.login);
router.post('/register', authREST.register);
router.post('/refresh', authREST.requestRefreshToken);
router.post('/logout', middleAuth.verifyToken, authREST.logOut);
router.put('/update', authREST.updatePassword);
router.get('/getauthbymail', authREST.getAuthByMail);
router.get('/checkpass', authREST.checkPassword);
module.exports = router;
