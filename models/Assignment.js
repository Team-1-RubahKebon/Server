const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // QuestionId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Question",
  // },
  ClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  assignmentDate: {
    type: Date,
    required: true,
  },
  StudentAnswers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentAnswer",
    },
  ],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
