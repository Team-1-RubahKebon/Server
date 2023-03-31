const multer = require("multer");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");

const { Storage } = require("@google-cloud/storage");

// Creates a client
const googleStorage = new Storage({
  projectId: credential.project_id,
  keyFilename: "../arctic-plasma-377908-7bbfda6bfa06.json",
});

async function uploadFile() {
  const options = {
    destination: destFileName,
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
  };

  await googleStorage.bucket(bucketName).upload(filePath, options);
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
