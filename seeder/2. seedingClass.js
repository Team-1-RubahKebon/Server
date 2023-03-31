const Class = require("../models/Class");

require("../connection");

async function seeding() {
  try {
    let subjects = ["Math", "Chemistry", "Physics", "Biology"];
    let classes = require("../mock_data/classes.json").map((el) => {
      el.schedule = el.schedule.map((sch) => {
        let randomIdx = Math.floor(Math.random() * subjects.length);
        sch.subjects = subjects[randomIdx];
        return sch;
      });
      el.Assignments = [];
      return el;
    });

    let seedClass = await Class.insertMany(classes);

    console.log(seedClass);
  } catch (err) {
    console.log(err);
  }
}

seeding();
