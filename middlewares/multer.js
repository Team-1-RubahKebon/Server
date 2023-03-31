const multer = require("multer");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");

async function uploadFile() {
  const options = {
    destination: "test_file.jpeg",

    preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
  };

  await googleStora.bucket(bucketName).upload(filePath, options);
  console.log(`${filePath} uploaded to ${bucketName}`);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./test");
  },
  filename: function (req, file, cb) {
    // console.log(req.user); => dari authentication. untuk ubah file original name jadi tiap murid
    cb(null, file.originalname);
  },
});
// const storage = googleStorage({
//   projectId: credential.project_id,
//   keyFilename: "../arctic-plasma-377908-7bbfda6bfa06.json",
// });

// const bucket = storage.bucket();

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
