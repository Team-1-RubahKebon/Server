const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./test");
  },
  filename: function (req, file, cb) {
    // console.log(req.user); => dari authentication. untuk ubah file original name jadi tiap murid
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  // fileFilter: function (req, file, cb) {
  //   if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //     return cb(new Error("Only image files are allowed!"));
  //   }
  //   cb(null, true);
  // },
  fieldName: "images",
});

module.exports = { upload };
