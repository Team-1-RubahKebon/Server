require("../connection");
const Hash = require("../helpers/Hash");
const users = require("../mock_data/users.json");
const User = require("../models/User");

async function seeding() {
  try {
    let hashedUsers = users.map((el) => {
      el.password = Hash.create(el.password);
      return el;
    });

    let createdUsers = await User.insertMany(hashedUsers);
    console.log(createdUsers);
  } catch (err) {
    console.log(err);
  }
}

seeding();
