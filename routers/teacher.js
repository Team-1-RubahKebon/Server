const TeacherController = require("../controllers/TeacherController");

const routerTeacher = require("express").Router();

routerTeacher.post("/login", TeacherController.login);

module.exports = routerTeacher;
