const Errors = require("../helpers/Errors");
const User = require("../models/User");
const Hash = require("../helpers/Hash");
const Token = require("../helpers/Token");
const { OAuth2Client } = require("google-auth-library");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");
const Question = require("../models/Question");

module.exports = class TeacherController {
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

      if (user.role !== "Teacher") {
        throw new Errors(403, "You are not teacher");
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
        role: "Teacher",
      });

      let registeringUser = await user.save();

      let access_token = Token.create({ id: registeringUser._id });

      res.status(201).json({ access_token, name: registeringUser.name });
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token_google } = req.headers;
      const client = new OAuth2Client(credential.client_id);
      const ticket = await client.verifyIdToken({
        idToken: token_google,
        audience: credential.client_id, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const filter = { email: payload.email };
      const update = {
        $setOnInsert: {
          username: payload.name,
          email: payload.email,
          password: "googlePassword",
          role: "Teacher",
        },
      };

      const options = { upsert: true, new: true, setDefaultsOnInsert: true };

      const result = await User.findOneAndUpdate(filter, update, options);
      const user = result.toObject();
      // const created = result._doc && result._doc.__v === 0;

      const access_token = createToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  }

  static async getClass(req, res, next) {
    try {
      let allClass = await Class.find({});

      allClass = await Promise.all(
        allClass.map(async (el) => {
          let Assignments = await Assignment.find({ ClassId: el._id });
          el.Assignments = Assignments;
          return el;
        })
      );

      res.status(200).json(allClass);
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

  static async createAssignment(req, res, next) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      let { name, ClassId, subject, deadline, assignmentDate, questionForm } =
        req.body;

      if (
        !questionForm ||
        !questionForm.questions ||
        questionForm.questions.length < 15
      ) {
        throw new Errors(
          400,
          "Must include 15 questions when creating assignment"
        );
      }

      if (!name || !ClassId || !subject || !deadline || !assignmentDate) {
        throw new Errors(400, "All assignment details must be filled");
      }

      let { questions } = questionForm;

      let questionCreated = await Question.create({ questions });

      let assignmentCreated = await Assignment.create({
        name,
        ClassId,
        QuestionId: questionCreated._id,
        subject,
        deadline,
        assignmentDate,
      });

      assignmentCreated.Question = questionCreated;

      await session.commitTransaction();
      session.endSession();

      res.status(201).json(assignmentCreated);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      next(err);
    }
  }
};
