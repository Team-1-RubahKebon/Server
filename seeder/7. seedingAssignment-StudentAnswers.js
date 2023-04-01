require("../connection");
const { ObjectId } = require("mongodb");
const Assignment = require("../models/Assignment");
const StudentAnswer = require("../models/StudentAnswer");

async function seeding() {
  try {
    let assignments = await Assignment.find();

    assignments.forEach(async (el) => {
      let studentAnswers = await StudentAnswer.find({ Assignment: el._id });
      let adaptedStudentAnswers = studentAnswers.map((el) => el._id);

      let updatedAsgn = await Assignment.updateOne(
        { _id: el._id },
        { $set: { StudentAnswers: adaptedStudentAnswers } }
      );
      console.log(updatedAsgn);
    });
  } catch (err) {
    console.log(err);
  }
}

seeding();
