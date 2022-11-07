const middleAuth = require('../rest/middleAuth');

const router = require('express').Router();

const messageREST = require('../rest/messageREST');

router.post('/', middleAuth.verifyToken, messageREST.addMess);
router.put('/add_seen/:id', middleAuth.verifyToken, messageREST.addUserSeenToMess);
router.put('/delete_mess/:id/:idMess', middleAuth.verifyToken, messageREST.deleteMess);
router.get('/id/:id', middleAuth.verifyToken, messageREST.getMessageById);
router.get('/limit', middleAuth.verifyToken, messageREST.getMessageByIdChat);
router.get('/mess_file', middleAuth.verifyToken, messageREST.getMessageFileByIdChat);

module.exports = router;
