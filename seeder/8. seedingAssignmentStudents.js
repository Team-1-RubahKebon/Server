const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const User = require("../models/User");

require("../connection");

async function seeding() {
  try {
    let users = await User.find();
    users.forEach((el) => {
      console.log(el);
    });
  } catch (err) {
    console.log(err);
  }
}

seeding();
