const Errors = require("../helpers/Errors");
const User = require("../models/User");
const Hash = require("../helpers/Hash");
const Token = require("../helpers/Token");
const { OAuth2Client } = require("google-auth-library");
const credential = require("../arctic-plasma-377908-7bbfda6bfa06.json");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const { default: mongoose } = require("mongoose");
const Question = require("../models/Question");
const { ObjectId } = require("mongodb");

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
      let { email, name, password, address, Class } = req.body;

      if (!email || !password) {
        throw new Errors(400, "required fields must be filled");
      }
      password = Hash.create(password);

      let user = new User({
        email,
        name,
        password,
        address,
        role: "Teacher",
        Class: new ObjectId(Class),
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
        audience: credential.client_id,
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

      const access_token = createToken({ id: user.id });
      res.status(200).json({ access_token });
    } catch (err) {
      next(err);
    }
  }

  static async getClasses(req, res, next) {
    try {
      let allClass = await Class.find({})
        .populate("Assignments")
        .populate("Teacher")
        .populate("Students");

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

  static async getAssignment(req, res, next) {
    try {
      let _id = req.params.id;

      let assignmentById = await Assignment.findOne({ _id }).populate(
        "ClassId"
      );

      res.status(200).json(assignmentById);
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

      // if (
      //   !questionForm ||
      //   !questionForm.questions ||
      //   questionForm.questions.length < 15
      // ) {
      //   throw new Errors(
      //     400,
      //     "Must include 15 questions when creating assignment"
      //   );
      // }

      if (!name || !ClassId || !subject || !deadline || !assignmentDate) {
        throw new Errors(400, "All assignment details must be filled");
      }

      let questionCreated = new Question(questionForm);

      await questionCreated.save();

      let assignmentCreated = await Assignment.create({
        name,
        ClassId,
        QuestionId: questionCreated._id,
        subject,
        deadline,
        assignmentDate,
      });

      let updateClass = await Class.updateOne(
        {
          _id: assignmentCreated.ClassId,
        },
        { $push: { Assignments: assignmentCreated._id } }
      );

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

  static async createClass(req, res, next) {
    //! ini harus dihandle besok
    try {
      let { name, schedule, Students, Teacher } = req.body;

      if (!name || !schedule || !Students || !Teacher) {
        throw new Errors(400, "All class details must be filled");
      }

      await Class.create({
        name,
        classAvg: 0,
        schedule,
        Assignments: [],
        Students,
        Teacher,
      });

      res.status(200).json({ message: "Class has been successfully added" });
    } catch (err) {
      next(err);
    }
  }

  static async getClass(req, res, next) {
    try {
      let classId = req.params.id;
      let singleClass = await Class.findById(classId)
        .populate("Assignments")
        .populate("Teacher")
        .populate("Students");

      res.status(200).json(singleClass);
    } catch (err) {
      next(err);
    }
  }

  static async destroyAssignment(req, res, next) {
    try {
      let id = req.params.id;
      await Assignment.findByIdAndDelete(id);
      res.status(200).json("Assigment has been successfully deleted");
    } catch (err) {
      next(err);
    }
  }
};
