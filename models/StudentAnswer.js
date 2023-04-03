const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Assignment = require("./Assignment");

const studentAnswerSchema = new mongoose.Schema({
  Assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    // required: true,
  },
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  status: {
    type: String,
    enum: ["Assigned", "Returned", "Missing"],
    required: true,
  },
  imgUrl: String,
  turnedAt: Date,
  score: Number,
  Answers: [
    {
      rowNumber: {
        type: mongoose.Schema.Types.Mixed,
      },
      answer: String,
      answerType: {
        enum: ["pg", "essay"],
      },
      isWrong: Boolean,
    },
  ],
});

studentAnswerSchema.pre("insertMany", async function () {
  try {
    Assignment.updateOne(
      {
        _id: new ObjectId(this.Assignment),
      },
      {
        $push: { StudentAnswers: this._id },
      },
      { multi: true }
    ).exec();
  } catch (err) {
    next(err);
  }
});

studentAnswerSchema.pre("save", async function () {
  try {
    Assignment.updateOne(
      {
        _id: new ObjectId(this.Assignment),
      },
      {
        $push: { StudentAnswers: this._id },
      },
      { multi: true }
    ).exec();
  } catch (err) {
    next(err);
  }
});

const StudentAnswer = mongoose.model("StudentAnswer", studentAnswerSchema);

module.exports = StudentAnswer;
