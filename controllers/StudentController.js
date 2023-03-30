const { ImageAnnotatorClient } = require("@google-cloud/vision");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");

const client = new ImageAnnotatorClient(credential);

module.exports = class StudentController {
  static async home() {}
  static async recognizing(req, res, next) {
    try {
      const [result] = await client.documentTextDetection(req.file.path);

      console.log(req.file.filename);
      console.log(result.textAnnotations[0].description);

      res.status(200).json(result.textAnnotations[0].description);
    } catch (err) {
      next(err);
    }
  }
};
