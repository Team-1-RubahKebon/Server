const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  QuestionId: {
    type: String,
    required: true,
  },
  ClassId: {
    type: String,
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
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
