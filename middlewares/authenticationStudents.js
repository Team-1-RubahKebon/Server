const Errors = require("../helpers/Errors");
const Token = require("../helpers/Token");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers.access_token;
    if (!token) {
      throw new Errors(401, "You are not authorized");
    }
    
    let { id: _id } = Token.verify(token);

    let user = await User.findById(_id);

    if (!user || user.role !== "Student") {
      throw new Errors(401, "You are not authorized");
    }

    req.user = user;


    next();
  } catch (err) {
    next(err);
  }
};
