const TeacherController = require("../controllers/TeacherController");

const routerTeacher = require("express").Router();

routerTeacher.post("/login", TeacherController.login);
routerTeacher.post("/googlein", TeacherController.googleLogin);
routerTeacher.post("/register", TeacherController.register);
routerTeacher.post("/googleLogin", TeacherController.googleLogin);
routerTeacher.get("/class", TeacherController.getClass);
routerTeacher.post("/class", TeacherController.createClass);
routerTeacher.get("/assignments", TeacherController.getAssignments);
routerTeacher.post("/assignments", TeacherController.createAssignment);

module.exports = routerTeacher;
