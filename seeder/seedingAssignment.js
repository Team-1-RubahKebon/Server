const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
require("../connection");
let assignments = require("../mock_data/assignment.json");

async function seeding() {
  let classes = await (await Class.find()).map((el) => el.id);

  assignments = assignments.map((el) => {
    let idx = Math.floor(Math.random() * classes.length);
    let randomClass = classes[idx];
    el.ClassId = randomClass;

    return el;
  });

  let assignmentsSeed = await Assignment.insertMany(assignments);

  console.log(assignmentsSeed);
}

seeding();
