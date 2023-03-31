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
  turnedAt: Date,
  Answers: [
    {
      rowNumber: {
        type: Number,
        required: true,
      },
      answer: String,
      answerType: {
        enum: ["pg", "essay"],
        required: true,
      },
      isWrong: Boolean,
    },
  ],
});

const StudentAnswer = mongoose.model("StudentAnswer", studentAnswerSchema);

module.exports = StudentAnswer;
