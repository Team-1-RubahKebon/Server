const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);

module.exports = class Hash {
  static create(password) {
    return bcrypt.hashSync(password, salt);
  }
  static verify(password, hashedPass) {
    return bcrypt.compareSync(password, hashedPass);
  }
};
