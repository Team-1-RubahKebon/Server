const mongoose = require("mongoose");

const classUserSchema = new mongoose.Schema({
  ClassId: {
    type: String,
    required: true,
  },
  UserId: {
    type: String,
    required: true,
  },
  scoreAvg: {
    type: Number, //1 - 100
  },
});

const ClassUser = mongoose.model("ClassUser", classUserSchema);

module.exports = ClassUser;
