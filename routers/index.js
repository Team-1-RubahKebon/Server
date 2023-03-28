const Controller = require("../controllers");
const router = require("express").Router();
const multer = require("multer");

router.get("/", Controller.home);

module.exports = router;
