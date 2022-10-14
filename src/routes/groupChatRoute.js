const router = require('express').Router();

const chatREST = require('../rest/groupChatREST');
const middleAuth = require('../rest/middleAuth');

router.post('/', middleAuth.verifyToken, chatREST.addChat);

router.get('/user_id', middleAuth.verifyToken, chatREST.getAllChatByUserId);
router.get('/id/:id', middleAuth.verifyToken, chatREST.getChatById);

module.exports = router;
