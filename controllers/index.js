const Errors = require("../helpers/Errors");
const Hash = require("../helpers/Hash");
const Token = require("../helpers/Token");
const User = require("../models/User");

module.exports = class Controller {
  static async home(req, res, next) {
    try {
      res.send("ok");
    } catch (err) {
      next(err);
    }
  }
};
