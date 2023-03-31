const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  schedule: [
    {
      day: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      },
      subjects: {
        type: String,
        enum: ["Math", "Chemistry", "Physics", "Biology"],
      },
    },
  ],
  Assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
});

const Class = mongoose.model("Class", classSchema);

module.exports = Class;
