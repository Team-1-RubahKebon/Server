const Class = require("../models/Class");
const User = require("../models/User");
require("../connection");

async function seeding() {
  let classes = await Class.find();
  let adaptedClasses = classes.map((el) => el._id);

  classes.forEach(async (el) => {
    el.Students.forEach(async (stud) => {
      let user = await User.findOne({ _id: stud._id });
      let updatedUser = await user.updateOne({ Class: el._id });
      console.log(updatedUser);
    });
  });
}

seeding();
