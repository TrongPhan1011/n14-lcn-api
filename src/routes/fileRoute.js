const multer = require('multer');
const router = require('express').Router();

const fileREST = require('../rest/fileREST');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/images', upload.array('images', 50), fileREST.uploadFile);

module.exports = router;
