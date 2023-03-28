module.exports = class Errors extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = { message };
    super.name = "Handled";
  }
};
