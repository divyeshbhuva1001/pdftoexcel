const express = require("express");

const filedataController = require('../controller/filedata')

const router = express.Router();
const { upload } = require('../utils/multer');


router.post('/insertpdf', upload, filedataController.insertpdf)
router.get('/getdata', filedataController.GetData)

module.exports = router