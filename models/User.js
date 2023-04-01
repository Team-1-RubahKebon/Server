const mongoose = require("mongoose");
const Hash = require("../helpers/Hash");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: "Email is required",
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid email format",
    ],
  },
  password: {
    type: String,
    required: "Password is required",
  },
  role: {
    type: String,
    enum: ["Student", "Teacher"],
  },
  Class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: "Class Id is required",
  },
  scoreAvg: {
    type: Number,
  },
  address: String,
  profilePicture: String,
});

// userSchema.pre("save", (next) => {
//   console.log(this.password);
//   this.password = Hash.create(this.password);
//   next();
// });
//urus nanti setelah hampir kelar

const User = mongoose.model("User", userSchema);

module.exports = User;
