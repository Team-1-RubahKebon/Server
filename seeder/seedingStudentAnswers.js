let studentAnswers = require("../mock_data/StudentAnswers.json");
require("../connection");
const Assignment = require("../models/Assignment");
const StudentAnswer = require("../models/StudentAnswer");
const User = require("../models/User");

async function seeding() {
  try {
    let users = await User.find({ role: "Student" });
    let adaptedUsers = users.map((el) => el._id);

    let assignments = await Assignment.find();
    let adaptedAssignments = assignments.map((el) => el._id);

    console.log(adaptedUsers);
    console.log(adaptedAssignments);

    let studentAnswersUp = studentAnswers.map((el) => {
      let idxAsgn = Math.floor(Math.random() * adaptedAssignments.length);
      el.Assignment = adaptedAssignments[idxAsgn];

      let idxUser = Math.floor(Math.random() * adaptedUsers.length);
      el.Student = adaptedUsers[idxUser];
      return el;
    });

    let createdStudentAnswers = await StudentAnswer.insertMany(
      studentAnswersUp
    );

    console.log(createdStudentAnswers);
  } catch (err) {
    console.log(err);
  }
}

seeding();
