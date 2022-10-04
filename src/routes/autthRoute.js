const router = require('express').Router();

const authREST = require('../rest/authREST');

router.post('/', authREST.login);

module.exports = router;
