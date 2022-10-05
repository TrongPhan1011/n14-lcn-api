const router = require('express').Router();

const userREST = require('../rest/userREST');
const middleAuth = require('../rest/middleAuth');

router.post('/', userREST.addUser);

router.put('/addfriend/', userREST.addFriend);

router.get('/id/:id', middleAuth.verifyToken, userREST.getUserById);
router.get('/phonenumber/:phoneNumber', userREST.getUserByPhoneNumber);
router.get('/textsearch', userREST.getUserByTextSearch);
router.put('/leave_chat', userREST.leaveChat);
router.get('/friend/:id', userREST.getAllFriendByStatus);
router.put('/id/:id', userREST.updateUser);

module.exports = router;
