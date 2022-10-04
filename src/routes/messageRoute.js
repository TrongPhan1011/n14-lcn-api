const router = require('express').Router();

const messageREST = require('../rest/messageREST');

router.post('/', messageREST.addMess);
router.put('/add_seen/:id', messageREST.addUserSeenToMess);

module.exports = router;
