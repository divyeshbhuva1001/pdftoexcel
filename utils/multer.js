const multer = require("multer");
const path = require("path");
const fs = require("fs")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filePath = "upload";
    fs.mkdirSync(filePath, { recursive: true })
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    // const name = Date.now() + path.extname(file.originalname);
    // cb(null, name);
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("insertpdf");


module.exports = { upload };