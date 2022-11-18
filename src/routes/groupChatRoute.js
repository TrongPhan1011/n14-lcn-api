const router = require('express').Router();

const chatREST = require('../rest/groupChatREST');
const middleAuth = require('../rest/middleAuth');

router.post('/', middleAuth.verifyToken, chatREST.addChat);

router.get('/user_id', middleAuth.verifyToken, chatREST.getAllChatByUserId);
router.get('/id/:id', middleAuth.verifyToken, chatREST.getChatById);
router.get('/idInbox', middleAuth.verifyToken, chatREST.getInboxByIdFriend);
router.get('/member', middleAuth.verifyToken, chatREST.getMemberOfChat);

router.get('/memberWaiting', middleAuth.verifyToken, chatREST.getMemberWaiting);

router.put('/member/:id', middleAuth.verifyToken, chatREST.addMember);
router.put('/admin/:id', middleAuth.verifyToken, chatREST.addAdminChat);
router.put('/status/:id', middleAuth.verifyToken, chatREST.changeStatusChat);
router.put('/requestMember/:id', middleAuth.verifyToken, chatREST.requestMemberChat);
router.put('/removeMember/:id', middleAuth.verifyToken, chatREST.removeMemberChat);
router.put('/removeChat/:id', middleAuth.verifyToken, chatREST.removeChat);
router.put('/memberLeaveChat/:id', middleAuth.verifyToken, chatREST.memberLeaveChat);
router.put('/changeNameChat/:id', middleAuth.verifyToken, chatREST.changeNameChat);

module.exports = router;
