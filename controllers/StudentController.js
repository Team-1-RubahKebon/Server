const { ImageAnnotatorClient } = require("@google-cloud/vision");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");
const Errors = require("../helpers/Errors");
const Hash = require("../helpers/Hash");
const Token = require("../helpers/Token");
const User = require("../models/User");
const { OAuth2Client } = require('google-auth-library');
const Assignment = require("../models/Assignment");

const client = new ImageAnnotatorClient(credential);

module.exports = class StudentController {
  static async home() { }
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
      const client = new OAuth2Client(credential.client_id);

      const ticket = await client.verifyIdToken({
        idToken: req.headers.token_google,
        audience: credential.client_id,
      });
      const payload = ticket.getPayload();

      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: 'bebas',
          role: 'student'
        },
        hooks: false
      });
      const payloadController = {
        id: user.id
      }

      const access_token = createToken(payloadController)
      res.status(200).json({ access_token, user })
    } catch (err) {
      next(err);
    }
  }

  static async getStudents(req, res, next) {
    try {
      let users = await User.find({
        role: "Student",
        // class: req.user.class
      });


      let newUsers = users.map(el => {
        delete el._doc.password
        return el
      })

      res.status(200).json(newUsers);
    } catch (err) {
      next(err);
    }
  }

  static async getStudentById(req, res, next) {
    try {
      let user = await User.find({ _id: req.params.id });


      let newUser = user.map(el => {
        delete el._doc.password
        return el
      })

      res.status(200).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  static async getAssignments(req, res, next) {
    try {
      let assignments = await Assignment.find();
      res.status(200).json(assignments);
    } catch (err) {
      next(err);
    }
  }

  static async getAssignment(req, res, next) {
    try {
      let _id = req.params.id;

      let assignmentById = await Assignment.findOne({ _id });

      let assignedClass = await Class.findOne({ _id: assignmentById.ClassId });

      let assignment = { ...assignmentById._doc, Class: assignedClass };

      res.status(200).json(assignment);
    } catch (err) {
      next(err);
    }
  }
  static async getAssignmentById(req, res, next) {
    try {
      let _id = req.params.id;
      let assignmentById = await Assignment.findOne({ _id });
      let assignedClass = await Class.findOne({ _id: assignmentById.ClassId });
      let assignment = { ...assignmentById._doc, Class: assignedClass };
      res.status(200).json(assignment);
    } catch (err) {
      next(err);
    }
  }


};
