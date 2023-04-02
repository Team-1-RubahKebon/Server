const TeacherController = require("../controllers/TeacherController");
const authentication = require("../middlewares/authenticationTeachers");

const routerTeacher = require("express").Router();

routerTeacher.post("/login", TeacherController.login); //done testting
routerTeacher.post("/googlein", TeacherController.googleLogin);
routerTeacher.post("/register", TeacherController.register); //done testing

// routerTeacher.use(authentication); //auth goes here

routerTeacher.get("/class", TeacherController.getClasses); //done testing
routerTeacher.post("/class", authentication, TeacherController.createClass); //done testing
routerTeacher.get("/assignments", TeacherController.getAssignments); //done testing
routerTeacher.post("/assignments", TeacherController.createAssignment); //done testing
routerTeacher.get("/class/:id", TeacherController.getClass); //done testing
routerTeacher.get("/assignments/:id", TeacherController.getAssignment); //done testing
routerTeacher.delete("/assignments/:id", TeacherController.destroyAssignment); //done testing

module.exports = routerTeacher;
