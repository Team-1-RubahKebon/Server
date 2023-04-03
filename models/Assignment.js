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

  let students = this.Students;

  students.forEach(async (el) => {
    let studentAnswer = new StudentAnswer({
      Assignment: this._id,
      Student: el._id,
      status: "Assigned",
      imgUrl: "",
      score: 0,
      Answers: [],
    });
    let createdStudentAnswer = await studentAnswer.save();
    this.StudentAnswers.push(createdStudentAnswer._id);
  });
  next();
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
