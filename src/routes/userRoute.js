const router = require('express').Router();

const userREST = require('../rest/userREST');
const middleAuth = require('../rest/middleAuth');

router.post('/', userREST.addUser);

router.put('/addfriend/', middleAuth.verifyToken, userREST.addFriend);
router.put('/deletefriend/', middleAuth.verifyToken, userREST.deleteFriend);
router.put('/acceptfriend/', middleAuth.verifyToken, userREST.acceptFriend);

router.get('/id/:id', middleAuth.verifyToken, userREST.getUserById);
router.get('/phonenumber/:phoneNumber', middleAuth.verifyToken, userREST.getUserByPhoneNumber);
router.get('/account/:accountId', userREST.getUserByAccountId);
router.get('/textsearch', middleAuth.verifyToken, userREST.getUserByTextSearch);
router.put('/leave_chat', middleAuth.verifyToken, userREST.leaveChat);
router.get('/friend/:id', middleAuth.verifyToken, userREST.getAllFriendByStatus);
router.put('/id/:id', middleAuth.verifyToken, userREST.updateUser);
router.put('/profile/avatar', middleAuth.verifyToken, userREST.updateAvatar);
module.exports = router;
