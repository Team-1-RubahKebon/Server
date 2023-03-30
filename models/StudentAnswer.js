const mongoose = require("mongoose");

const studentAnswerSchema = new mongoose.Schema({
  AssignmentId: {
    type: String,
    required: true,
  },
  StudentId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  imgUrl: String,
});

const StudentAnswer = mongoose.model("StudentAnswer", studentAnswerSchema);

module.exports = StudentAnswer;
