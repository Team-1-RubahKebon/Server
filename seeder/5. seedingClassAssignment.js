const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
require("../connection");

async function seeding() {
  try {
    let classes = await Class.find();

    classes.forEach(async (kelas) => {
      let assignments = await Assignment.find({
        ClassId: kelas._id,
      });
      let adaptorAssignments = assignments.map((el) => el._id);
      if (assignments) {
        let updatedClass = await Class.updateOne(
          {
            _id: kelas._id,
          },
          { $set: { Assignments: adaptorAssignments } }
        );

        console.log(updatedClass);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

seeding();
