const multer = require("multer");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");
const multerGoogleStorage = require("multer-google-storage");

let storage = multerGoogleStorage.storageEngine({
  keyFilename: "./arctic-plasma-377908-7bbfda6bfa06.json",
  bucket: process.env.BUCKET_NAME,
  autoRetry: true,
  maxRetries: 3,
  projectId: credential.project_id,
});

const upload = multer({ storage });

module.exports = { upload, storage };
