const Controller = require("../controllers");
const router = require("express").Router();
const studentsRouter = require("./student");

router.get("/", Controller.home);

router.use("/students", studentsRouter);

module.exports = router;
