const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questions: [
    {
      rowNumber: {
        type: Number,
        // required: true,
      },
      question: {
        type: String,
        // required: true,
      },
      selection: {
        A: String,
        B: String,
        C: String,
        D: String,
      },
      answerType: {
        type: String,
        enum: ["pg", "essay"],
      },
      keyword: {
        type: String,
      },
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
