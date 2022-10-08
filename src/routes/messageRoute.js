const router = require('express').Router();

const messageREST = require('../rest/messageREST');

router.post('/', messageREST.addMess);
router.put('/add_seen/:id', messageREST.addUserSeenToMess);
router.put('/delete_mess/:id/:idMess', messageREST.deleteMess);
router.get('/id/:id', messageREST.getMessageById);

module.exports = router;
