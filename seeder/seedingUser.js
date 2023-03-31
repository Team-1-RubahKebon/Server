const Class = require("../models/Class");
const User = require("../models/User");
require("../connection");

async function seeding() {
  let users = await User.find();
  let classes = await Class.find();
  let adaptedClasses = classes.map((el) => el._id);

  users.forEach(async (el) => {
    let randomIdx = Math.floor(Math.random() * classes.length);
    el.Class = adaptedClasses[randomIdx];
    let updatedUser = await User.updateOne({ _id: el._id }, el);
    console.log(updatedUser);
  });
}

seeding();
