const router = require('express').Router();

const chatREST = require('../rest/groupChatREST');

router.post('/', chatREST.addChat);
router.put('/mess/:idChat/:idMess', chatREST.addUserSeenToMess);
router.put('/add_mess/:id', chatREST.addMessToChat);

router.get('/user_id', chatREST.getAllChatByUserId);
router.put('/delete_mess/:id', chatREST.deleteMess);
module.exports = router;
