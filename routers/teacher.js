const TeacherController = require("../controllers/TeacherController");

const routerTeacher = require("express").Router();

routerTeacher.post("/login", TeacherController.login);
routerTeacher.post("/googlein", TeacherController.googleLogin);
routerTeacher.post("/register", TeacherController.register);
routerTeacher.get("/class", TeacherController.getClasses);
routerTeacher.post("/class", TeacherController.createClass);
routerTeacher.get("/assignments", TeacherController.getAssignments);
routerTeacher.post("/assignments", TeacherController.createAssignment);
routerTeacher.get("/class/:id", TeacherController.getClass);
routerTeacher.get("/assignments/:id", TeacherController.getAssignment);
routerTeacher.delete("/assignments/:id", TeacherController.destroyAssignment);

module.exports = routerTeacher;
