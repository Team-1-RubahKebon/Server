const Controller = require("../controllers");
const router = require("express").Router();
const multer = require("multer");

router.get("/", Controller.home);
router.get("/login/teacher");
router.get("/login/student");

module.exports = router;
