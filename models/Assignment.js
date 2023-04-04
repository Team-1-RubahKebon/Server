const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Class = require("./Class");
const StudentAnswer = require("./StudentAnswer");

const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Assignment name is required",
  },
  QuestionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  ClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    // required: "Class is required",
  },
  subject: {
    type: String,
    required: "Subject must be defined",
  },
  deadline: {
    type: Date,
    required: "please pick date for deadline",
  },
  assignmentDate: {
    type: Date,
    required: "please pick date for starting assignment",
  },
  StudentAnswers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAnswer",
    },
  ],
  Students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

assignmentSchema.pre("deleteOne", function (next) {
  Class.updateOne(
    { _id: new ObjectId(this.ClassId) },
    { $pull: { Assignments: this._id } },
    { multi: true }
  ).exec();
  StudentAnswer.deleteMany({ Assignment: this._id }).exec();
  next();
});

assignmentSchema.pre("save", function (next) {
  Class.updateOne(
    { _id: new ObjectId(this.ClassId) },
    { $push: { Assignments: this._id } },
    { multi: true }
  ).exec();

  this.StudentAnswers = [];

  next();
});

assignmentSchema.post("save", async function (next) {
  try {
    let studentAnswers = [];
    let students = this.Students;
    let assignmentId = this._id;

    students.forEach(async (el) => {
      let studentAnswer = new StudentAnswer({
        Assignment: assignmentId,
        Student: el._id,
        status: "Assigned",
        imgUrl: "",
        score: 0,
        Answers: [],
      });
      let createdStudentAnswer = await studentAnswer.save();
      studentAnswers.push(createdStudentAnswer._id);
    });

    let updated = await Assignment.collection.updateOne(
      { _id: assignmentId },
      {
        $push: {
          StudentAnswers: {
            $each: studentAnswers,
          },
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
