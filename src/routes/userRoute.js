const router = require('express').Router();

const userREST = require('../rest/userREST');

/*

POST: thêm mới
PUT: sửa,
GET: lấy lên

*/
router.post('/', userREST.addUser);

router.put('/addfriend/', userREST.addFriend);

router.get('/id/:id', userREST.getUserById);
router.get('/phonenumber/:phoneNumber', userREST.getUserByPhoneNumber);
router.get('/textsearch', userREST.getUserByTextSearch);
router.get('/friend/:id', userREST.getAllFriendByStatus);

module.exports = router;
