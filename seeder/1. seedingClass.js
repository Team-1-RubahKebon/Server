require("../connection");
let classDB = require("../mock_data/classes.json");
const User = require("../models/User");
const Class = require("../models/Class");

async function seeding() {
  try {
    let subjects = ["Math", "Chemistry", "Physics", "Biology"];

    let students = await User.find({ role: "Student" });
    let adaptedStudents = students.map((el) => el._id);

    let teachers = await User.find({ role: "Teacher" });
    let adaptedTeachers = teachers.map((el) => el._id);

    // console.log(adaptedStudents);

    let classResult = classDB.map((el) => {
      el.Students = adaptedStudents.splice(0, 5);

      el.schedule = el.schedule.map((sch) => {
        let randomIdx = Math.floor(Math.random() * subjects.length);
        sch.subjects = subjects[randomIdx];
        return sch;
      });

      let idxTeacher = Math.floor(Math.random() * adaptedTeachers.length);
      el.Teacher = adaptedTeachers[idxTeacher];
      return el;
    });

    // console.log(JSON.stringify(classResult, null, 4));

    let createdClass = await Class.insertMany(classResult);

    console.log(createdClass);
  } catch (err) {
    console.log(err);
  }
}

seeding();
