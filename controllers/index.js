module.exports = class Controller {
  static async home(req, res, next) {
    try {
      let { id } = req.params;
      if (!id) {
        throw new Errors(400, "Id must be filled");
      }
    } catch (err) {
      next(err);
    }
  }
};
