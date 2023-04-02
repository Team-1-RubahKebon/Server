const TeacherController = require("../controllers/TeacherController");
const authentication = require("../middlewares/authenticationTeachers");

const routerTeacher = require("express").Router();

routerTeacher.post("/login", TeacherController.login); //done testting
routerTeacher.post("/googlein", TeacherController.googleLogin);
routerTeacher.post("/register", TeacherController.register); //done testing

// routerTeacher.use(authentication); //auth goes here

routerTeacher.get("/class", authentication, TeacherController.getClasses); //done testing
routerTeacher.post("/class", authentication, TeacherController.createClass); //done testing
routerTeacher.get(
  "/assignments",
  authentication,
  TeacherController.getAssignments
); //done testing
routerTeacher.post(
  "/assignments",
  authentication,
  TeacherController.createAssignment
); //done testing
routerTeacher.get("/class/:id", authentication, TeacherController.getClass); //done testing
routerTeacher.get(
  "/assignments/:id",
  authentication,
  TeacherController.getAssignment
); //done testing
routerTeacher.delete(
  "/assignments/:id",
  authentication,
  TeacherController.destroyAssignment
); //done testing
routerTeacher.get("/answers/:courseId", TeacherController.getStudentAnswers);
routerTeacher.post("/ai", TeacherController.chatOpenAi);

module.exports = routerTeacher;
