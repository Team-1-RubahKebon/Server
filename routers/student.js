const StudentController = require("../controllers/StudentController");
const { upload } = require("../middlewares/multer");
const studentsRouter = require("express").Router();

studentsRouter.post("/login", StudentController.login);
studentsRouter.post("/googlein", StudentController.googleLogin);
studentsRouter.post("/register", StudentController.register);
studentsRouter.get("/", StudentController.getStudents);
studentsRouter.get("/assignments", StudentController.getAssignments);
studentsRouter.post(
  "/upload/:courseId",
  upload.single("file"),
  StudentController.recognizing
);
studentsRouter.get("/", StudentController.getStudents);

module.exports = studentsRouter;
