const middleAuth = require('../rest/middleAuth');

const router = require('express').Router();

const messageREST = require('../rest/messageREST');

router.post('/', middleAuth.verifyToken, messageREST.addMess);
router.put('/add_seen/:id', middleAuth.verifyToken, messageREST.addUserSeenToMess);
router.put('/delete_mess/:id/:idMess', middleAuth.verifyToken, messageREST.deleteMess);
router.get('/id/:id', middleAuth.verifyToken, messageREST.getMessageById);

module.exports = router;
