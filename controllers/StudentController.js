const { ImageAnnotatorClient } = require("@google-cloud/vision");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");
const Errors = require("../helpers/Errors");
const Hash = require("../helpers/Hash");
const Token = require("../helpers/Token");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const StudentAnswer = require("../models/StudentAnswer");
const { ObjectId } = require("mongodb");
const ocrAdapter = require("../helpers/ocrAdapter");
const dateFormatter = require("../helpers/dateFormatter");
const { default: mongoose } = require("mongoose");

const client = new ImageAnnotatorClient(credential);

module.exports = class StudentController {
  static async getClass(req, res, next) {
    try {
      let classes = await Class.find();

      res.status(200).json(classes);
    } catch (err) {
      next(err);
    }
  }
  static async createStudentAnswer(req, res, next) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      console.log(req.user);
      let assignmentId = req.params.courseId;
      const fileUri = req.file.linkUrl;

      if (!assignmentId) {
        throw new Errors(404, "Not found");
      }

      const assignmentCheck = await Assignment.findOne({
        _id: new ObjectId(assignmentId),
      });

      if (!assignmentCheck) {
        throw new Errors(404, "Not found");
      }

      const options = {
        image: { source: { imageUri: fileUri } },
        features: [
          { type: "DOCUMENT_TEXT_DETECTION" },
          { type: "FORMULA_DETECTION" },
        ],
      };

      const [result] = await client.annotateImage(options);

      const text = result.fullTextAnnotation.text;

      const answers = ocrAdapter(text);

      console.log(answers);

      if (!answers.length) {
        throw new Errors(400, "Wrong Form Format");
      }

      let studentId = req.user._id;
      let status = "Assigned";
      let dateNow = new Date();
      let turnedAt = dateFormatter(dateNow);
      console.log(assignmentId);

      let StudentAnswerCreate = new StudentAnswer({
        Assignment: new ObjectId(assignmentId),
        Student: new ObjectId(studentId),
        status,
        imgUrl: fileUri,
        turnedAt,
        Answers: answers,
      });

      let created = await StudentAnswerCreate.save({ session });

      console.log(created);

      let updateAssignment = await Assignment.updateOne(
        {
          _id: new ObjectId(assignmentId),
        },
        { $push: { StudentAnswers: created._id } },
        { session }
      );

      console.log(updateAssignment);
      await session.commitTransaction();
      session.endSession();

      res.status(200).json(created);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
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
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      let { email, name, password, address, ClassId } = req.body;

      if (!email || !name || !password) {
        throw new Errors(400, "required fields must be filled");
      }

      // password = Hash.create(password);

      let user = new User({
        email,
        name,
        password,
        address,
        Class: new ObjectId(ClassId),
        role: "Student",
      });

      let registeringUser = await user.save({
        session,
      });
      let updateClass = await Class.updateOne(
        {
          _id: registeringUser.Class,
        },
        { $push: { Students: registeringUser._id } },
        {
          session,
        }
      );

      console.log(updateClass);

      let access_token = Token.create({ id: registeringUser._id });

      await session.commitTransaction();
      session.endSession();
      res.status(201).json({ access_token, name: registeringUser.name });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
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
          password: "bebas",
          role: "student",
        },
        hooks: false,
      });
      const payloadController = {
        id: user.id,
      };

      const access_token = createToken(payloadController);
      res.status(200).json({ access_token, user });
    } catch (err) {
      next(err);
    }
  }

  static async getStudents(req, res, next) {
    try {
      let users = await User.find({
        role: "Student",
        // Class: req.user.Class,
      });

      let newUsers = users.map((el) => {
        delete el._doc.password;
        return el;
      });

      res.status(200).json(newUsers);
    } catch (err) {
      next(err);
    }
  }

  static async getStudentById(req, res, next) {
    try {
      let user = await User.findOne({ _id: req.params.id }).populate("Class");
      console.log(user, "ini user <<<<<<<<<<<<<<<<<<,");
      delete user._doc.password;

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async getAssignments(req, res, next) {
    try {
      let ClassId = req.user.Class
      console.log(req.user);
      let assignments = await Assignment.find({
        ClassId
      }).populate("ClassId");

      res.status(200).json(assignments);
    } catch (err) {
      next(err);
    }
  }

  static async getAssignmentById(req, res, next) {
    try {
      let _id = req.params.id;
      let assignmentById = await Assignment.findOne({ _id })
        .populate("ClassId")
        .populate("StudentAnswers")
        .populate("QuestionId");

      res.status(200).json(assignmentById);
    } catch (err) {
      next(err);
    }
  }

  static async getStudentAnswers(req, res, next) {
    try {
      let _id = req.user._id;
      if (!_id) {
        throw new Errors(404, "Student not found");
      }

      let studentAnswers = await StudentAnswer.find({ Student: _id });

      res.status(200).json(studentAnswers);
    } catch (err) {
      next(err);
    }
  }

  static async getStudentAnswerById(req, res, next) {
    try {
      let _id = req.params.id;

      if (!_id) {
        throw new Errors(404, "Answers not found");
      }

      let studentAnswer = await StudentAnswer.findOne({ Student: _id })
        .populate("Assignment")
        .populate("Student")
        .populate('Answers') //kalo udah up answers baru uncomment

      res.status(200).json(studentAnswer);
    } catch (err) {
      next(err);
    }
  }
};