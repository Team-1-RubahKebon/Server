if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const multerCloudStorage = require("multer-cloud-storage");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");

const storage = new Storage({
  projectId: credential.project_id,
  keyFilename: "../arctic-plasma-377908-7bbfda6bfa06.json",
});

const multerStorage = multerCloudStorage({
  storageBucket: process.env.BUCKET_NAME,
  acl: "public-read",
  projectId: credential.project_id,
  keyFilename: "../arctic-plasma-377908-7bbfda6bfa06.json",
});

const upload = multer({ storage: multerStorage });

module.exports = upload;
