const StudentController = require("../controllers/StudentController");
const { upload } = require("../middlewares/multer");
const studentsRouter = require("express").Router();

studentsRouter.post(
  "/upload/:courseId",
  upload.single("file"),
  StudentController.recognizing
);

module.exports = studentsRouter;
