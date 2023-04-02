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
const StudentAnswer = require("../models/StudentAnswer");
const openai = require("../config/openAI");

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
      // password = Hash.create(password);

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
      let name = req.query.name;
      let query = {};

      if (name) {
        query.name = { $regex: `${name}` };
      }
      let allClass = await Class.find(query)
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
      let ClassId = req.query.Class;
      let name = req.query.name;
      let query = {};

      if (ClassId) {
        query.ClassId = ClassId;
      }

      if (name) {
        query.name = { $regex: `${name}` };
      }

      let assignments = await Assignment.find(query).populate("ClassId");

      res.status(200).json(assignments);
    } catch (err) {
      next(err);
    }
  }

  static async getAssignment(req, res, next) {
    try {
      let _id = req.params.id;
      console.log(_id);

      let assignmentById = await Assignment.findOne({ _id })
        .populate("ClassId")
        .populate("StudentAnswers")
        .populate("QuestionId");

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

      console.log(req.body);

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

      await questionCreated.save({ session });

      let assignmentCreated = new Assignment({
        name,
        ClassId,
        QuestionId: questionCreated._id,
        subject,
        deadline,
        assignmentDate,
      });
      await assignmentCreated.save({ session });

      let updateClass = await Class.updateOne(
        {
          _id: assignmentCreated.ClassId,
        },
        { $push: { Assignments: assignmentCreated._id } },
        { session }
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

  static async updateAssignment(req, res, next) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      let { questionForm, StudentAnswers } = req.body;
      let _id = req.params.id;

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

      let assignment = await Assignment.findOne(
        { _id: new ObjectId(_id) },
        { session }
      ).populate("QuestionId");

      let question = assignment.QuestionId;

      // let studentAnswerUpdate = StudentAnswers.forEach(async (el) => {
      //   await StudentAnswer.updateOne(
      //     {
      //       _id: new ObjectId(el._id),
      //     },
      //     { status: "Returned" },
      //     { session }
      //   );
      // });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(question);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      next(err);
    }
  }

  static async createClass(req, res, next) {
    try {
      let { name, schedule } = req.body;

      if (!name || !schedule) {
        throw new Errors(400, "All class details must be filled");
      }

      let Teacher = req.user._id;

      await Class.create({
        name,
        classAvg: 0,
        schedule,
        Assignments: [],
        Students: [],
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
      res
        .status(200)
        .json({ message: "Assigment has been successfully deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async getStudentAnswers(req, res, next) {
    try {
      let assignmentId = req.params.courseId;

      let studentAnswers = await StudentAnswer.find({
        Assignment: new ObjectId(assignmentId),
      }).populate("Student");

      res.status(200).json(studentAnswers);
    } catch (err) {
      next(err);
    }
  }

  static async chatOpenAi(req, res, next) {
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: req.body.chat,
        temperature: 0.5,
        max_tokens: 2048,
      });

      res.status(200).json({ message: completion.data.choices[0].text });
    } catch (err) {
      next(err);
    }
  }
};
