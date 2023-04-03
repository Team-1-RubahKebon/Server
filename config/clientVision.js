const { ImageAnnotatorClient } = require("@google-cloud/vision");


const client = new ImageAnnotatorClient({
    keyFilename: "./arctic-plasma-377908-7bbfda6bfa06.json",
  });

  module.exports = client