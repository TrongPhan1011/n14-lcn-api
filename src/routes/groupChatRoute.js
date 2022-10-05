const router = require('express').Router();

const chatREST = require('../rest/groupChatREST');
const middleAuth = require('../rest/middleAuth');

router.post('/', chatREST.addChat);

router.get('/user_id', chatREST.getAllChatByUserId);
router.get('/id/:id', chatREST.getChatById);

module.exports = router;
