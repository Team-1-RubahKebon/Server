const users = require("./mock_data/users.json").filter(
  (el) => el.role == "Student"
);

console.log(users.length);
