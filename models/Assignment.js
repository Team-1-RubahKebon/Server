const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Assignment name is required",
  },
  // QuestionId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Question",
  // },
  ClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: "Class is required",
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
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
