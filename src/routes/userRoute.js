const router = require('express').Router();

const userREST = require('../rest/userREST');
const middleAuth = require('../rest/middleAuth');

router.post('/', userREST.addUser);

router.put('/addfriend/', middleAuth.verifyToken, userREST.addFriend);
router.put('/deletefriend/', middleAuth.verifyToken, userREST.deleteFriend);
router.put('/acceptfriend/', middleAuth.verifyToken, userREST.acceptFriend);
router.put('/blockfriend/', middleAuth.verifyToken, userREST.blockFriend);

router.get('/id/:id', middleAuth.verifyToken, userREST.getUserById);
router.get('/phonenumber/:phoneNumber', middleAuth.verifyToken, userREST.getUserByPhoneNumber);
router.get('/account/:accountId', userREST.getUserByAccountId);
router.get('/textsearch', middleAuth.verifyToken, userREST.getUserByTextSearch);
router.get('/friend/:id', middleAuth.verifyToken, userREST.getAllFriendByStatus);

router.put('/id/:id', middleAuth.verifyToken, userREST.updateUser);
router.put('/profile/', middleAuth.verifyToken, userREST.updateUserProfile);
router.put('/profile/avatar', middleAuth.verifyToken, userREST.updateAvatar);
router.put('/profile/banner', middleAuth.verifyToken, userREST.updateBanner);
module.exports = router;
