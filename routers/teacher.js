const TeacherController = require("../controllers/TeacherController");
const authentication = require("../middlewares/authenticationTeachers");

const routerTeacher = require("express").Router();

routerTeacher.post("/login", TeacherController.login);
routerTeacher.post("/googlein", TeacherController.googleLogin);
routerTeacher.post("/register", TeacherController.register);

// routerTeacher.use(authentication); //auth goes here

routerTeacher.get("/class", TeacherController.getClasses);
routerTeacher.post("/class", TeacherController.createClass);
routerTeacher.get("/assignments", TeacherController.getAssignments);
routerTeacher.post("/assignments", TeacherController.createAssignment);
routerTeacher.get("/class/:id", TeacherController.getClass);
routerTeacher.get("/assignments/:id", TeacherController.getAssignment);
routerTeacher.delete("/assignments/:id", TeacherController.destroyAssignment);

module.exports = routerTeacher;
