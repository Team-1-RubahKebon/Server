const { ObjectId } = require("mongodb");
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
require("../connection");

async function seeding() {
  try {
    let class1 = await Class.findOne({
      _id: new ObjectId("642690626946f9457e8bd91e"),
    });

    let assignments = await Assignment.find({
      ClassId: new ObjectId(class1._id),
    });

    let objAssignments = assignments.map((el) => el._id);

    // let updateClass = await Class.updateOne(
    //   {
    //     _id: new ObjectId("642690626946f9457e8bd91e"),
    //   },
    //   { $set: { Assignments: objAssignments } }
    // );

    console.log(updateClass);
  } catch (err) {
    console.log(err);
  }
}

seeding();
