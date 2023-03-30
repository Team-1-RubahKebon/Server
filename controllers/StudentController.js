const { ImageAnnotatorClient } = require("@google-cloud/vision");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");
const Errors = require("../helpers/Errors");
const Hash = require("../helpers/Hash");
const Token = require("../helpers/Token");
const User = require("../models/User");

const client = new ImageAnnotatorClient(credential);

module.exports = class StudentController {
  static async home() {}
  static async recognizing(req, res, next) {
    try {
      const [result] = await client.documentTextDetection(req.file.path);

      console.log(req.file.filename);
      console.log(result.textAnnotations[0].description);

      res.status(200).json(result.textAnnotations[0].description);
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      let { email, password } = req.body;

      if (!email || !password) {
        throw new Errors(400, "Email/Password must be filled");
      }

      let user = await User.findOne({ email });
      if (!user) {
        throw new Errors(401, "Wrong Email/Password");
      }

      if (user.role !== "Student") {
        throw new Errors(403, "You are not student");
      }

      let valid = Hash.verify(password, user.password);

      if (!valid) {
        throw new Errors(401, "Wrong Email/Password");
      }

      let access_token = Token.create({ id: user._id });

      res.status(200).json({ access_token, name: user.name });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      let { email, name, password, address } = req.body;

      if (!email || !name || !password) {
        throw new Errors(400, "required fields must be filled");
      }

      password = Hash.create(password);

      let user = new User({
        email,
        name,
        password,
        address,
        role: "Student",
      });

      let registeringUser = await user.save();

      console.log(registeringUser);

      let access_token = Token.create({ id: registeringUser._id });

      res.status(201).json({ access_token, name: registeringUser.name });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      //isi google login
    } catch (err) {
      next(err);
    }
  }

  static async getStudents(req, res, next) {
    try {
      let users = await User.find({ role: "Student" });

      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }
};
