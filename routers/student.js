const StudentController = require("../controllers/StudentController");
const authentication = require("../middlewares/authenticationStudents");
const { upload } = require("../middlewares/multer");
const studentsRouter = require("express").Router();

studentsRouter.post("/login", StudentController.login);
studentsRouter.post("/googlein", StudentController.googleLogin);
studentsRouter.post("/register", StudentController.register);
studentsRouter.get("/class", StudentController.getClass);

studentsRouter.use(authentication); //auth goes here

studentsRouter.get("/", StudentController.getStudents);
studentsRouter.get("/assignments", StudentController.getAssignments);
studentsRouter.get("/class", StudentController.getClass);
studentsRouter.get("/answers", StudentController.getStudentAnswers);
studentsRouter.get("/answers/assigned", StudentController.getStudentAnswersAssigned);
studentsRouter.get("/answers/returned", StudentController.getStudentAnswersReturned);
studentsRouter.get("/answers/:id", StudentController.getStudentAnswerById);
studentsRouter.post(
  "/upload/:assignmentId",
  upload.single("image"),
  StudentController.createStudentAnswer
);
studentsRouter.get("/profile", StudentController.getStudentById);
studentsRouter.get("/assignments/:id", StudentController.getAssignmentById);
studentsRouter.get("/average", StudentController.getAverageScore);

module.exports = studentsRouter;
