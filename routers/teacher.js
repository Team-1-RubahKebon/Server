const TeacherController = require("../controllers/TeacherController");

const routerTeacher = require("express").Router();

routerTeacher.post("/login", TeacherController.login);
routerTeacher.post("/register", TeacherController.register);
routerTeacher.post("/googleLogin", TeacherController.googleLogin);
routerTeacher.get("/class", TeacherController.getClass);

module.exports = routerTeacher;
