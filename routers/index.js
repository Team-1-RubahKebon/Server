const Controller = require("../controllers");
const router = require("express").Router();
const studentsRouter = require("./student");
const routerTeacher = require("./teacher");

router.get("/", Controller.home);

router.use("/students", studentsRouter);
router.use("/teachers", routerTeacher);

module.exports = router;
