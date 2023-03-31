const { Storage } = require("@google-cloud/storage");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");

const googleStorage = new Storage({
  projectId: credential.project_id,
  keyFilename: "../arctic-plasma-377908-7bbfda6bfa06.json",
});

/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
module.exports = googleStorage;
