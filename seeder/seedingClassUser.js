const Class = require("./models/Class");
const ClassUser = require("./models/ClassUser");
const User = require("./models/User");
require("./connection");

async function seeding() {
  let students = await User.find({ role: "Student" });

  let classes = await Class.find();

  let classUsers = await ClassUser.find(); // require json nya

  classUsers.forEach(async (el) => {
    let idx = Math.floor(Math.random() * classes.length);
    let studentIdx = Math.floor(Math.random() * students.length);

    el.ClassId = classes[idx]._id;
    el.UserId = students[studentIdx]._id;

    let classUser = await ClassUser.findById(el._id);

    let updated = await classUser.updateOne(el);
    const Class = require("./models/Class");
    const ClassUser = require("./models/ClassUser");
    const User = require("./models/User");
    require("./connection");

    async function seeding() {
      let students = await User.find({ role: "Student" });

      let classes = await Class.find();

      let classUsers = await ClassUser.find();

      classUsers.forEach(async (el) => {
        let idx = Math.floor(Math.random() * classes.length);
        let studentIdx = Math.floor(Math.random() * students.length);

        el.ClassId = classes[idx]._id;
        el.UserId = students[studentIdx]._id;

        let classUser = await ClassUser.findById(el._id);

        let updated = await classUser.updateOne(el);

        console.log(updated);
      });
    }

    seeding();
  });
}

seeding();
