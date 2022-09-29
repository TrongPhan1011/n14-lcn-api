const router = require('express').Router();

const userREST = require('../rest/userREST');

router.post('/', userREST.addUser);

router.put('/addfriend/', userREST.addFriend);

router.get('/:id', userREST.getUserById);
router.get('/phonenumber/:phoneNumber', userREST.getUserByPhoneNumber);

module.exports = router;
