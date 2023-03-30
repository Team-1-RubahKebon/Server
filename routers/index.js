const Controller = require("../controllers");
const router = require("express").Router();
const multer = require("multer");
const studentsRouter = require("./student");

router.get("/", Controller.home);
router.get("/login/teacher");
router.get("/login/student");
router.use("/students", studentsRouter);

module.exports = router;
